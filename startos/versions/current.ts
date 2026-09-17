import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { production } from '../release'
import { productionVersion, productionImage } from '../production'

export const current = VersionInfo.of({
  // upstream:wrapper — the upstream half tracks the Umbrel store's package
  // counter for the same image pin, so
  // testers see one version across both platforms; the wrapper half bumps
  // for StartOS-only packaging changes.
  version: production ? productionVersion : '0.1.12:0',
  releaseNotes: {
    en_US: production
      ? `Production ${productionVersion}: Esplora fallback for pruned Core, authorization renewal and payout fixes. Back up before updating; existing data is retained. Image ${productionImage}. Package-checked; no StartOS device upgrade test. Release prepared by Codex (/root).`
      : `Staging FMan on Manifold 1c55dff0 (Fedimint 0.12), matching Umbrel 0.1.12. Shares guardian API connection pools to avoid redundant endpoint discovery and reconnects; includes the latest operator dashboard and PeerBadge SDK updates. Back up data before updating. Existing 0.11 upgrades and packaged-device upgrades have not been qualified. Staging only; test funds.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
