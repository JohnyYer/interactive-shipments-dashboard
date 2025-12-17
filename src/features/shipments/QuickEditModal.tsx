import { useState } from "react";
import type { Shipment, ShipmentStatus } from "../../models/shipment";
import { ALL_STATUSES } from "../../models/shipment";
import styles from "./QuickEditModal.module.scss";

type Payload = Pick<Shipment, "destination" | "status">;

type Props = {
    open: boolean;
    shipment: Shipment | null;
    onCancel: () => void;
    onSave: (shipmentId: string, payload: Payload) => Promise<void>;
};

export function QuickEditModal({ open, shipment, onCancel, onSave }: Props) {
    const [destination, setDestination] = useState(() => shipment?.destination ?? "");
    const [status, setStatus] = useState<ShipmentStatus>(() => shipment?.status ?? "Booked");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open || !shipment) return null;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await onSave(shipment.id, { destination, status });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setSaving(false);
        }
    };

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Quick Edit Shipment">
            <form className={styles.modal} onSubmit={submit}>
                <h2 className={styles.title}>Quick Edit Shipment</h2>

                <div className={styles.content}>
                    <div>
                        <div className={styles.metaLabel}>Shipment</div>
                        <div>{shipment.id}</div>
                    </div>

                    <label className={styles.field}>
                        Destination
                        <input
                            className={styles.input}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={saving}
                        />
                    </label>

                    <label className={styles.field}>
                        Status
                        <select
                            className={styles.select}
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                            disabled={saving}
                        >
                            {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </label>

                    {error && (
                        <div role="alert" className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={onCancel} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving || destination.trim().length === 0}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
