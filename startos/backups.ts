import * as fs from 'fs'
import * as path from 'path'
import { sdk } from './sdk'

const mainVolume = '/media/startos/volumes/main'

// Excluded from backups:
// - Each seat's live fedimintd consensus database: a copy of a running
//   database is torn, and a corrupt one is worse than none. fedimintd writes
//   db_checkpoints for exactly this, so restore seeds each seat from its
//   newest checkpoint — and only when that seat has no database already, so
//   a restore over a live install leaves it alone.
// - Safe-event journals (daemon and per-seat): a supported restore excludes
//   them (SPEC-guardian-telemetry-proxy in the manifold repo) — restored
//   journals would collide with the incarnation the collector has seen.
// - admin.sock and fleet-manager.lock: runtime artifacts of the live daemon.
// The daemon's own fleet-manager.sqlite is included as-is; the authoritative
// recovery path for fleet identity remains the daemon's Nostr backup/restore
// onboarding (SPEC-nostr-backup-restore in the manifold repo).
export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) =>
    sdk.Backups.ofVolumes('main')
      .setOptions({
        exclude: [
          'seats/*/data/database',
          'seats/*/data/database.db.lock',
          'seats/*/safe-events',
          'safe-events',
          'admin.sock',
          'fleet-manager.lock',
        ],
      })
      .setPostRestore(async (effects) => {
        const seatsDir = path.join(mainVolume, 'seats')
        if (!fs.existsSync(seatsDir)) return

        for (const seatNo of fs.readdirSync(seatsDir)) {
          const dataDir = path.join(seatsDir, seatNo, 'data')
          const dbDir = path.join(dataDir, 'database')
          const checkpointsDir = path.join(dataDir, 'db_checkpoints')

          if (fs.existsSync(dbDir) || !fs.existsSync(checkpointsDir)) continue

          const checkpoints = fs.readdirSync(checkpointsDir).sort()
          const latest = checkpoints[checkpoints.length - 1]
          if (!latest) continue

          console.info(
            `Seat ${seatNo}: restoring database from checkpoint ${latest}`,
          )
          fs.cpSync(path.join(checkpointsDir, latest), dbDir, {
            recursive: true,
          })
        }
      }),
)
