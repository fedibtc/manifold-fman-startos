import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  // upstream:wrapper — the upstream half tracks the Umbrel store's package
  // counter for the same image pin, so
  // testers see one version across both platforms; the wrapper half bumps
  // for StartOS-only packaging changes.
  version: '0.1.8:0',
  releaseNotes: {
    en_US: `Staging version. Please see git log.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
