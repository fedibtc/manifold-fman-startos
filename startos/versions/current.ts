import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  // upstream:wrapper — the upstream half tracks the Umbrel store's package
  // counter for the same image pin, so
  // testers see one version across both platforms; the wrapper half bumps
  // for StartOS-only packaging changes.
  version: '0.1.10:0',
  releaseNotes: {
    en_US: `Staging version on Manifold master f06c7bbd. Includes the Fedimint v0.11.2-fedi4 P2P deadlock fix and guardian fee policy updates. Staging only; test funds and disposable data.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
