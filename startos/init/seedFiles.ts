import { randomBytes } from 'crypto'
import { storeJson } from '../fileModels/store'
import { sdk } from '../sdk'

// Generate the operator password once, on first init. The store is the
// canonical copy; main.ts rewrites the password file the daemon reads on
// every start, so a restore onto another machine heals file modes and
// ownership automatically.
export const seedFiles = sdk.setupOnInit(async (effects) => {
  const existing = await storeJson.read((s) => s.operatorPassword).once()
  if (!existing) {
    const operatorPassword = randomBytes(16).toString('base64url')
    await storeJson.merge(effects, { operatorPassword })
    console.info('Generated operator dashboard password')
  }
})
