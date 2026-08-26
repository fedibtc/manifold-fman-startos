import { readFile } from 'fs/promises'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { passwordVolumePath } from '../utils'

export const showPassword = sdk.Action.withoutInput(
  // id
  'show-password',

  // metadata
  async ({ effects }) => ({
    name: i18n('Show Dashboard Password'),
    description: i18n(
      'Show the generated password for the operator dashboard login',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // the execution function
  async ({ effects }) => {
    const password = (await readFile(passwordVolumePath, 'utf-8')).trim()
    return {
      version: '1',
      title: i18n('Dashboard Password'),
      message: i18n('Log in to the operator dashboard with the password below'),
      result: {
        type: 'single',
        value: password,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
