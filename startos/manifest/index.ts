import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  // Distinct from a future production `fleet-manager` id so a staging test
  // install can never be mistaken for (or upgraded into) a production one —
  // the same split the Umbrel store makes with `fedi-dev-fleet-manager`.
  id: 'fedi-dev-fleet-manager',
  title: 'Fleet Manager (staging)',
  license: 'MIT',
  packageRepo: 'https://github.com/fedibtc/manifold-fman-startos',
  upstreamRepo: 'https://github.com/fedibtc/manifold',
  marketingUrl: 'https://fedi.xyz',
  donationUrl: null,
  description: {
    short: {
      en_US: 'Run a Fedimint guardian seat on the Manifold staging environment',
    },
    long: {
      en_US:
        'Fleet Manager coordinates Fedimint guardian seat formation and supervises bundled fedimintd children. This staging test build targets the Manifold staging environment (Mutinynet/Signet via the built-in Esplora backend) — test money only, no Bitcoin node required. Seats derive their count from available RAM (one per 1.5 GiB, capped at 8) and peer over iroh. The operator dashboard is embedded in the daemon and protected by a generated password (see the Show Dashboard Password action).',
    },
  },
  volumes: ['main'],
  images: {
    fman: {
      // Thin Dockerfile over the pinned ghcr.io/fedibtc/manifold-fman image.
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // Staging profile uses its default public Esplora; deliberately no bitcoind
  // dependency, matching the Umbrel staging app.
  dependencies: {},
})
