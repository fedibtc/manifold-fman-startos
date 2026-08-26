import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  // upstream:wrapper — the upstream half tracks the Umbrel store's package
  // counter for the same image pin (0.1.7 = manifold master d090989b), so
  // testers see one version across both platforms; the wrapper half bumps
  // for StartOS-only packaging changes.
  version: '0.1.7:0',
  releaseNotes: {
    en_US: `First StartOS release of Fleet Manager (staging), bundling manifold master d090989b (fedimintd 0.11.1-fedi15) — the same build as Umbrel store release 0.1.7.

Runs the Manifold staging profile (Mutinynet/Signet via the built-in Esplora backend — test money only, no Bitcoin node required). Onboard from the operator dashboard; log in with the generated password from the Show Dashboard Password action. Seat iroh UDP ports 30000-30031 are published for direct guardian peer paths.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
