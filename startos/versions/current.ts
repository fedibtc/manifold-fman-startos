import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { production } from '../release'
import { productionVersion, productionImage } from '../production'

export const current = VersionInfo.of({
  // upstream:wrapper — the upstream half tracks the Umbrel store's package
  // counter for the same image pin, so
  // testers see one version across both platforms; the wrapper half bumps
  // for StartOS-only packaging changes.
  version: production ? productionVersion : '0.1.13:0',
  releaseNotes: {
    en_US: production
      ? `Production ${productionVersion}: Fedimint v0.12.0-fedi4 with same-chain Core/Esplora routing, primary-first broadcast fallback, Esplora block validation, and DKG fixes. Image ${productionImage}. Back up the complete stopped data directory before updating. Existing 0.11 guardian upgrades and packaged-device upgrades have not been qualified. Preserve existing data; do not uninstall, reset, or re-onboard. Production rollout requires upgrade qualification with existing guardian and wallet data.`
      : `Staging FMan on Manifold 395e3b6ab673b51f00a949644d641f6697ebdb13, matching Umbrel 0.1.13. Includes Fedimint v0.12.0-fedi4 with same-chain Core/Esplora routing, primary-first broadcast fallback, Esplora block validation, and DKG fixes. Back up the complete stopped data directory before updating. Existing 0.11 guardian upgrades and packaged-device upgrades have not been qualified. Staging only; test funds.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
