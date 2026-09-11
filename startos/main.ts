import * as fs from 'fs'
import { FileHelper } from '@start9labs/start-sdk'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store'
import { production } from './release'
import { passwordContainerPath, passwordVolumePath, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(
    production ? 'Starting Fleet Manager' : 'Starting Fleet Manager (staging)',
  )

  // Seeded on install; .const() restarts the daemon if it ever changes.
  const operatorPassword = await storeJson
    .read((s) => s.operatorPassword)
    .const(effects)
  if (!operatorPassword) {
    throw new Error(i18n('Operator password has not been generated yet'))
  }

  // The daemon reads (never writes) --admin-http-password-file and refuses
  // group/other access, so write it host-side with an explicit mode on every
  // start.
  fs.writeFileSync(passwordVolumePath, `${operatorPassword}\n`, {
    mode: 0o600,
  })

  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/data',
    readonly: false,
  })

  if (production) {
    mounts = mounts.mountDependency({
      dependencyId: 'bitcoind',
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/bitcoin',
      readonly: true,
    })
  }

  const fmanSub = sdk.SubContainer.of(
    effects,
    { imageId: 'fman' },
    mounts,
    'fman-sub',
  )

  const bitcoin: string[] = []
  if (production) {
    // Bitcoin Core 28.x exports host "rpc", port 8332, and main/.cookie.
    // React to address and cookie changes when Bitcoin restarts.
    const address = await sdk.host
      .getBridgeAddress(effects, {
        packageId: 'bitcoind',
        hostId: 'rpc',
        internalPort: 8332,
        ssl: false,
      })
      .const()
    if (!address) throw new Error('Local Bitcoin Core is not reachable')
    const rootfs = await fmanSub.rootfs
    const cookie = await FileHelper.string(`${rootfs}/mnt/bitcoin/.cookie`)
      .read(
        (value) => value?.trim(),
        (previous, next) => next === null || previous === next,
      )
      .const(effects)
    if (!cookie || !/^[^:]+:.+$/.test(cookie)) {
      throw new Error('Local Bitcoin Core RPC credentials are unavailable')
    }
    const colon = cookie.indexOf(':')
    bitcoin.push(
      '--bitcoind-url',
      `http://${address}`,
      '--bitcoind-username',
      cookie.slice(0, colon),
      `--bitcoind-password=${cookie.slice(colon + 1)}`,
    )
  }

  return sdk.Daemons.of(effects).addDaemon('fman', {
    subcontainer: fmanSub,
    exec: {
      // Production uses local Bitcoin Core; staging uses Mutinynet Esplora.
      // Both run without push notifications and keep automatic telemetry.
      // The dashboard is the embedded operator UI on the admin listener;
      // StartOS exposes it without platform auth, so `password` mode is
      // required (`trusted-proxy` is sound only behind an authenticating
      // proxy such as Umbrel's).
      command: [
        '/bin/fleet-manager',
        'serve',
        '--data-dir',
        '/data',
        '--manifold-environment',
        production ? 'production' : 'staging',
        ...bitcoin,
        '--admin-http-bind',
        `0.0.0.0:${uiPort}`,
        '--admin-http-auth',
        'password',
        '--admin-http-password-file',
        passwordContainerPath,
      ],
      env: {
        // The Nix image's config Env is not inherited by SubContainer exec;
        // restate what the daemon needs. Staging dials HTTPS Esplora and
        // Nostr relays, so the bundled CA store must be discoverable.
        SSL_CERT_FILE: '/etc/ssl/certs/ca-bundle.crt',
        // Defense-in-depth for arti's fs-mistrust getpwuid lookups inside
        // SubContainer (see Dockerfile /etc materialization).
        FS_MISTRUST_DISABLE_PERMISSIONS_CHECKS: 'true',
      },
    },
    ready: {
      display: i18n('Operator Dashboard'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The operator dashboard is ready'),
          errorMessage: i18n('The operator dashboard is not ready'),
        }),
    },
    requires: [],
  })
})
