import { sdk } from './sdk'
import { production } from './release'

export const setDependencies = sdk.setupDependencies(async () =>
  production
    ? {
        bitcoind: {
          kind: 'running',
          versionRange: '>=28.4:14',
          healthChecks: ['bitcoind', 'sync-progress'],
        },
      }
    : {},
)
