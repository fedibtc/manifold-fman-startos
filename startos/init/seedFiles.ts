import { randomBytes } from 'crypto'
import * as fs from 'fs'
import { sdk } from '../sdk'
import { passwordVolumePath } from '../utils'

// Generate the operator password once, on first init. The daemon reads (never
// writes) --admin-http-password-file and requires mode 0600 with a non-empty
// value; a stable file also keeps the login valid across restarts and rides
// along in backups.
export const seedFiles = sdk.setupOnInit(async (effects) => {
  if (fs.existsSync(passwordVolumePath)) return

  const password = randomBytes(16).toString('base64url')
  fs.writeFileSync(passwordVolumePath, `${password}\n`, { mode: 0o600 })
  console.info('Generated operator dashboard password')
})
