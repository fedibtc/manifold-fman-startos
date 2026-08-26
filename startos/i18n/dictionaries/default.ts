export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Fleet Manager (staging)!': 0,
  'Operator Dashboard': 1,
  'The operator dashboard is ready': 2,
  'The operator dashboard is not ready': 3,

  // interfaces.ts
  'Onboarding and dashboard for this Fleet Manager host — log in with the generated password (Show Dashboard Password action)': 4,
  'Seat Iroh Ports': 5,
  'UDP sockets for direct guardian peer connectivity (first 8 seats)': 6,

  // actions/showPassword.ts
  'Show Dashboard Password': 7,
  'Show the generated password for the operator dashboard login': 8,
  'Dashboard Password': 9,
  'Log in to the operator dashboard with the password below': 10,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
