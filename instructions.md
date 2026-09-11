# Fleet Manager

## Production app

**Fleet Manager** requires synced local Bitcoin Core on mainnet. Use **Show
Dashboard Password**, then onboard in the dashboard and obtain production issuer
authorization. Telemetry registers when authorization and the signed setup-payment
policy are available; push notifications are deferred. Data must survive updates:
never uninstall or reset to resolve an update error. Keep a backup and investigate.
Ports 31000–31031 forward TCP+UDP; TCP also serves the public guardian API.

The instructions below are for **Fleet Manager (staging)** only.

Internal Fedi test build. This service hosts Fedimint guardian seats on the
**Manifold staging environment** (Mutinynet/Signet): it advertises seat
capacity to Federation Initiators, sells seats, and supervises the bundled
`fedimintd` children through formation and operation. Test money only, no
warranty, and any manifold master build may invalidate its data. It needs no
Bitcoin node — the staging profile uses its built-in Esplora backend.

## Requirements

StartOS **0.4.0 stable or later**. On a 0.4.0-beta build the sideload page
fails with an `alerts is undefined` error — update the OS first (System →
Software Update).

## First start

1. Start the service and wait for the **Operator Dashboard** health check.
2. Run the **Show Dashboard Password** action (Actions tab) and copy the
   password.
3. Open the **Operator Dashboard**: use one of the interface's **address
   entries** (the Local `https://…` one; accept the self-signed-certificate
   warning unless you've installed your server's root CA). Known StartOS
   quirk: when you browse StartOS from the server itself (kiosk or a browser
   inside a VM), the Open button builds a dead `127.0.0.1:…` link — use the
   address entries instead.
4. Log in with the password, then onboard from the dashboard (`onboard new`):
   fleet identity, plans/pricing, and the setup-payment federation join.
   After onboarding, the first join of the setup-payment federation scans its
   full history — a couple of minutes during which the dashboard shows
   "Loading…". One-time cost; be patient.

Seat count derives from available RAM (one seat per 1.5 GiB, capped at 8);
you can override it in the daemon config.

## Make it discoverable (staging trust material)

A fresh FMan is invisible to Federation Initiators until it has a peer badge,
an offer, and a receivable setup-payment wallet. Everything except badge
issuance is done in the dashboard; badge issuance needs a dev:

1. Note your FMan's `service_nostr_pubkey` from the dashboard and send it to
   a dev on the team, who issues a level-9 badge (`manifold-test-issuer`,
   staging environment).
2. In the dashboard, open the enrollment/authorization screen (opening it
   triggers the fetch) and confirm the badge shows up.
3. Set your offer price in the dashboard's plans form.
4. Restart the service: the daemon auto-joins the staging setup-payment
   federation, but the advertisement loop only publishes after a restart once
   that wallet gate opens.
5. Verify: the staging relay should carry a kind-37701 advertisement from
   your `service_nostr_pubkey`.

After a fresh reinstall the fleet has a new identity and must be re-badged
before its advertisement is trusted.

## Networking

The package publishes UDP ports 30000–30031 (the iroh sockets of the first 8
guardian seats) so peers can connect directly. No router configuration is
required — seats fall back to public relays — but forwarding that UDP range
improves direct-path odds.

## Updates, backups, and data

- Data survives updates but **not** uninstall/reinstall. Builds with
  different database migrations are incompatible: if an update crash-loops
  with a migration error, uninstall, reinstall, and redo onboarding and the
  trust-material steps (staging data is disposable by design). Release notes
  call out when an update is this kind of breaking change.
- StartOS backups exclude live seat consensus databases; restores seed each
  seat from its newest `db_checkpoints`. The daemon's own Nostr backup
  remains the authoritative fleet-identity recovery path.
