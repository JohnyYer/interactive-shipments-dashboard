import { useEffect, useState } from "react";
import { fetchShipments } from "../../api/shipmentsApi";
import type { Shipment } from "../../models/shipment";
import { ShipmentsTable } from "./ShipmentsTable";

import styles from "./ShipmentsPage.module.scss";

export function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setLoadError(null);

    (async () => {
      try {
        const data = await fetchShipments();
        if (cancelled) return;
        setShipments(data);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Failed to load shipments"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shipments Dashboard</h1>

      {loading && <div>Loading shipments...</div>}

      {!loading && loadError && (
        <div role="alert" className={styles.alert}>
          {loadError}
        </div>
      )}

      {!loading && !loadError && <ShipmentsTable shipments={shipments} />}
    </div>
  );
}
