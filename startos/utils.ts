// Operator dashboard / HTTP admin API listener inside the container
// (SPEC-operator-http in the manifold repo).
export const uiPort = 8181

// Seat iroh UDP sockets: 4 ports per seat from base 30000, published for the
// first 8 lifetime seat ordinals (ordinals are never reused). A seat beyond
// the range still works but peers via public relays only; extend the range in
// a package update to restore direct paths for later ordinals.
export const irohFirstPort = 30000
export const irohPortCount = 32

// Generated operator password consumed by `--admin-http-password-file`. The
// daemon requires mode 0600 and refuses group/other access, so init writes it
// host-side with an explicit mode. It lives in the data volume, surviving
// restarts and riding along in backups.
export const passwordSubpath = '.operator-password'
export const passwordVolumePath = `/media/startos/volumes/main/${passwordSubpath}`
export const passwordContainerPath = `/data/${passwordSubpath}`
