/**
 * Motor de Caché Local Offline-First y Cola de Sincronización (`db-local`)
 * Permite registrar eventos críticos (arranques de batería, recalentamientos, fallas)
 * en medio de la ruta sin señal de internet, sincronizando con Supabase al recuperar red.
 * Ticket: TUA-018
 */

export interface OfflineSyncEvent {
  idempotencyKey: string;
  table: 'electrical_cranking_logs' | 'telemetry_snapshots' | 'vehicle_faults';
  payload: Record<string, unknown>;
  createdAt: number;
  synced: boolean;
}

export class OfflineStorageEngine {
  private outbox: Map<string, OfflineSyncEvent> = new Map();

  /**
   * Guarda un evento localmente garantizando idempotencia (sin duplicados si se reintenta).
   */
  public enqueueOfflineEvent(
    idempotencyKey: string,
    table: OfflineSyncEvent['table'],
    payload: Record<string, unknown>
  ): OfflineSyncEvent {
    const existing = this.outbox.get(idempotencyKey);
    if (existing) return existing;

    const record: OfflineSyncEvent = {
      idempotencyKey,
      table,
      payload,
      createdAt: Date.now(),
      synced: false,
    };
    this.outbox.set(idempotencyKey, record);
    return record;
  }

  public getPendingEvents(): OfflineSyncEvent[] {
    return Array.from(this.outbox.values()).filter((e) => !e.synced);
  }

  public async flushPendingToCloud(
    uploader: (events: OfflineSyncEvent[]) => Promise<string[]>
  ): Promise<number> {
    const pending = this.getPendingEvents();
    if (pending.length === 0) return 0;

    const confirmedKeys = await uploader(pending);
    for (const key of confirmedKeys) {
      const item = this.outbox.get(key);
      if (item) {
        item.synced = true;
      }
    }
    return confirmedKeys.length;
  }
}

export const sharedOfflineStorage = new OfflineStorageEngine();
