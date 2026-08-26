import { i18n } from './i18n'
import { sdk } from './sdk'
import { irohFirstPort, irohPortCount, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
    preferredExternalPort: uiPort,
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Operator Dashboard'),
    id: 'ui',
    description: i18n(
      'Onboarding and dashboard for this Fleet Manager host — log in with the generated password (Show Dashboard Password action)',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const uiReceipt = await uiMultiOrigin.export([ui])

  // Seat iroh sockets. Publishing the grid removes the NAT layer so iroh can
  // hole-punch direct guardian peer paths; without it seats silently fall
  // back to public relays. Ranges forward TCP+UDP; only UDP is used (iroh is
  // QUIC), the TCP side has no listener behind it.
  const irohRange = await sdk.MultiHost.of(effects, 'seat-iroh').bindPortRange({
    internalStartPort: irohFirstPort,
    externalStartPort: irohFirstPort,
    numberOfPorts: irohPortCount,
  })
  // Range exports carry no address receipt — only the UI interface does.
  await irohRange.export(
    sdk.createRangeInterface(effects, {
      id: 'seat-iroh',
      name: i18n('Seat Iroh Ports'),
      description: i18n(
        'UDP sockets for direct guardian peer connectivity (first 8 seats)',
      ),
    }),
  )

  return [uiReceipt]
})
