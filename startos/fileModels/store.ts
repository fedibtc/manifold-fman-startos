import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { z } from 'zod'

const shape = z.object({
  // Generated on install (init/seedFiles.ts). main.ts writes it to the
  // password file the daemon reads at every start; the Show Dashboard
  // Password action displays it.
  operatorPassword: z.string().nullable().catch(null),
})

// Lives at the root of the data volume alongside the daemon's own state; the
// daemon ignores foreign files in its data root.
export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
