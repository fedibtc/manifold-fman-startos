# Fleet Manager (staging) for StartOS

StartOS package for [Fleet Manager](https://github.com/fedibtc/manifold)
(FMan) against the Manifold **staging** environment — the StartOS counterpart
of the [Umbrel store](https://github.com/fedibtc/manifold-umbrel-store). Not
for production use: staging trust material only, test money (Mutinynet), and
data can be invalidated by any master build.

The image is the public `ghcr.io/fedibtc/manifold-fman` package, published by
manifold CI on every master merge and pinned by git-sha tag in the
`Dockerfile` here. At build time the image is embedded into the `.s9pk` — a
device never pulls from a registry. Versions track the Umbrel store's counter
for the same pin (`0.1.7:0` = Umbrel `0.1.7-master.d090989b`), with the
`:wrapper` half for StartOS-only changes.

The packaging follows the maintained
[fedimint-guardian-startos](https://github.com/Start9-Community/fedimint-guardian-startos)
wrapper (StartOS 0.4.0, `@start9labs/start-sdk` 2.x). FLIP will get a sibling
repo (`manifold-flip-startos`) — StartOS tooling wants one package per repo.

## What the package runs

- `fleet-manager serve --manifold-environment staging`: Signet/Mutinynet via
  the profile's default Esplora backend (no Bitcoin node dependency), no push
  gateway, RAM-derived seat count.
- The embedded operator dashboard on the admin listener, `password` auth mode
  with a package-generated password (**Show Dashboard Password** action).
  StartOS has no authenticating platform proxy, so Umbrel's `trusted-proxy`
  mode is unsound here.
- Seat iroh UDP ports 30000–30031 published for direct guardian peer paths
  (first 8 lifetime seat ordinals; relays remain the fallback).
- Backups exclude live seat consensus databases; restore seeds each seat from
  its newest `db_checkpoints`. The daemon's Nostr backup remains the
  authoritative fleet-identity recovery path.

## Installing

Download the `.s9pk` from this repo's GitHub Releases, then in StartOS click
**Sideload** in the top navigation bar and drop the file in. End-user usage
is in [instructions.md](./instructions.md) (also shown in-app).

## Building

Requires docker, node/npm, and
[start-cli](https://docs.start9.com/packaging/) on PATH.

```
make          # both architectures: fedi-dev-fleet-manager.s9pk
make x86      # or: make arm — single-architecture package
make install  # sideload to the dev machine configured in ~/.startos/config.yaml
```

## Releasing an update

1. Pick the manifold master commit to ship (its publish run must be green)
   and follow [UPDATING.md](./UPDATING.md) to bump the image pin.
2. Bump `version` (`upstream:wrapper`) and the release notes in
   `startos/versions/current.ts`. Flag incompatible database-migration
   changes in the notes — those need uninstall/reinstall, not update.
3. Push to master, then tag the release — same manual step as the Umbrel
   store's version bump:

   ```
   git tag v<upstream>_<wrapper>   # e.g. v0.1.8_0 for version '0.1.8:0'
   git push origin v<upstream>_<wrapper>
   ```

   The tag push triggers CI to build both `.s9pk`s and attach them to a
   GitHub release (and publish to the registry, if the `RELEASE_REGISTRY`
   repo var is set).
