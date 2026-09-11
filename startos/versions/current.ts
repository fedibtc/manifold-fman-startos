import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  // upstream:wrapper — the upstream half tracks the Umbrel store's package
  // counter for the same image pin, so
  // testers see one version across both platforms; the wrapper half bumps
  // for StartOS-only packaging changes.
  version: '0.1.11:0',
  releaseNotes: {
    en_US: `Staging FMan on Manifold bb63efca (Fedimint 0.12), matching Umbrel 0.1.11. Includes explicit child API/UI authentication and the stability-pool compatibility port. Fresh 0.12 formation and recovery were tested; upgrading existing 0.11 data has not been qualified. Back up data before updating. Staging only; test funds and disposable data.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
