import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  // upstream:wrapper — the upstream half tracks the Umbrel store's package
  // counter for the same image pin, so
  // testers see one version across both platforms; the wrapper half bumps
  // for StartOS-only packaging changes.
  version: '0.1.9:0',
  releaseNotes: {
    en_US: `Staging version on manifold master 1bd22f38. A Federation Initiator can now decommission its own seats against a development or staging FMan, so repeated federation setup testing no longer needs an operator to free capacity. FMan's SQLite migrations are unchanged since the previous pin, so this update keeps existing data. Otherwise please see git log.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
