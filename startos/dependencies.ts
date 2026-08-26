import { sdk } from './sdk'

// Staging profile: built-in Esplora backend, no platform services required.
export const setDependencies = sdk.setupDependencies(async () => ({}))
