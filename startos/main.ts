import { i18n } from './i18n'
import { sdk } from './sdk'
import { passwordContainerPath, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Fleet Manager (staging)!'))

  const mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/data',
    readonly: false,
  })

  const fmanSub = sdk.SubContainer.of(
    effects,
    { imageId: 'fman' },
    mounts,
    'fman-sub',
  )

  return sdk.Daemons.of(effects).addDaemon('fman', {
    subcontainer: fmanSub,
    exec: {
      // The image's stock entrypoint targets production (mainnet Bitcoin
      // Core, mandatory push gateway); this staging package runs the daemon
      // directly: Signet/Mutinynet via the staging profile's default Esplora
      // backend, no push gateway, RAM-derived seat count (no --max-seats).
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
        'staging',
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
