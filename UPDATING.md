# Updating the upstream image

The `fman` image is built locally from `Dockerfile`, which extends the
`ghcr.io/fedibtc/manifold-fman` image that manifold CI publishes on every
master merge. The daemon embeds the operator dashboard and fedimintd — there
is no separate UI or fedimintd image to pin.

## Picking the pin

Use the immutable full-git-sha tag of a master commit whose *Publish images*
workflow run is green (both architectures):

```
gh run list -R fedibtc/manifold --workflow "Publish images" --branch master
```

The staging pin lives in `Dockerfile` as `ARG FMAN_IMAGE=<full-git-sha>`;
production uses `productionImage` in `startos/production.ts`. Do not pin the moving
`master` tag — it changes under the package.

For production, update `productionImage` and `productionVersion` together,
edit the production release notes in `startos/versions/current.ts`, and follow
the production tag process in README.md. Updates must preserve existing data.

## Applying a staging bump

1. `Dockerfile` — replace the default `FMAN_IMAGE` commit.
2. `startos/versions/current.ts` — bump `version` and write release notes.
   The upstream half tracks the Umbrel store's counter for the same image
   pin (keep the two stores in step); bump the wrapper half for StartOS-only
   packaging changes.
3. If the new build changes database migrations, existing installs will
   crash-loop after the update: say so in the release notes and instruct
   uninstall/reinstall (staging data is disposable).
