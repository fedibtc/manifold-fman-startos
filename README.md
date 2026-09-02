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
for the same pin (`0.x.y:0` = Umbrel `0.x.y-master.abcdef01`), with the
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

A local build is signed with *your own* developer key, so it is for your own
testing only — don't hand it to anyone. Releases must come from CI. See
[Signing](#signing) below.

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

   The tag push triggers CI to build both `.s9pk`s, sign them, and attach
   them to a GitHub release (and publish to the registry, if the
   `RELEASE_REGISTRY` repo var is set). Nothing needs to be built or signed
   on your machine — anyone with write access can cut a release this way.

## Signing

Every `.s9pk` is signed with a developer key, and that key is the package's
identity — a build signed by a different key is a different developer as far
as StartOS is concerned. The registry enforces this directly: it verifies the
signature and rejects uploads from anyone not registered as a signer for the
package. Keeping one stable key is also what keeps updates continuous for
people who already have the package installed; a key that changes per release
is the one thing that reliably breaks that.

So this repo has one fixed key for the package, held as the `DEV_KEY` repo
secret and used by the release workflow. Its public half is:

```
MCowBQYDK2VwAyEAiAoe2OThc1d1yBfcLaur56OMBO6Dy7xUgy1iq/W9JPQ=
```

Two rules follow:

- **Release only through CI.** `make` on a laptop signs with whatever key is
  in that laptop's `~/.startos/id.key.pem`, which is a different identity for
  every one of us. Those builds are for local testing, never for distribution.
- **Never rotate or lose `DEV_KEY`.** GitHub cannot show you a secret again
  once it is set, so the secret is not a backup. Losing the key costs us the
  package's identity: we could not publish to a registry as the same package,
  and update continuity for existing installs is not something we would want
  to test the hard way.
