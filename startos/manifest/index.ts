import { setupManifest } from '@start9labs/start-sdk'
import { production } from '../release'
import { productionImage } from '../production'

export const manifest = setupManifest({
  // Separate app IDs keep production and staging data apart.
  id: production ? 'fleet-manager' : 'fedi-dev-fleet-manager',
  title: production ? 'Fleet Manager' : 'Fleet Manager (staging)',
  license: 'MIT',
  packageRepo: 'https://github.com/fedibtc/manifold-fman-startos',
  upstreamRepo: 'https://github.com/fedibtc/manifold',
  marketingUrl: 'https://fedi.xyz',
  donationUrl: null,
  description: {
    short: {
      en_US: production
        ? 'Run Fedimint guardians on Bitcoin mainnet'
        : 'Run a Fedimint guardian seat on the Manifold staging environment',
    },
    long: {
      en_US: production
        ? 'Fleet Manager runs Fedimint guardians using your local Bitcoin Core. Production and staging have separate identities and data. Updates preserve production data. The dashboard uses a generated password. Telemetry registers automatically after authorization and receipt of the signed setup-payment policy. Push notifications are deferred.'
        : 'Fleet Manager coordinates Fedimint guardian seat formation and supervises bundled fedimintd children. This staging test build targets the Manifold staging environment (Mutinynet/Signet via the built-in Esplora backend) — test money only, no Bitcoin node required. Seats derive their count from available RAM (one per 1.5 GiB, capped at 8) and peer over iroh. The operator dashboard is embedded in the daemon and protected by a generated password (see the Show Dashboard Password action).',
    },
  },
  volumes: ['main'],
  images: {
    fman: {
      // Thin Dockerfile over the pinned ghcr.io/fedibtc/manifold-fman image.
      source: {
        dockerBuild: {
          buildArgs: production ? { FMAN_IMAGE: productionImage } : {},
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: production
    ? {
        bitcoind: {
          description:
            'Local Bitcoin Core supplies the production mainnet chain.',
          optional: false,
          metadata: {
            title: 'Bitcoin',
            icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
          },
        },
      }
    : {},
})
