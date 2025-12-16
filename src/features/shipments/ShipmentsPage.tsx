import { useEffect, useMemo, useState } from "react";
import { fetchShipments } from "../../api/shipmentsApi";
import type { Shipment, ShipmentStatus } from "../../models/shipment";
import { ShipmentsTable } from "./ShipmentsTable";

import styles from "./ShipmentsPage.module.scss";
import { ShipmentsFilter } from "./ShipmentsFilter";

export function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  //Filter state
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "All">(
    "All"
  );

  // Fetch shipments
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

  const filteredShipments = useMemo(() => {
    if (statusFilter === "All") return shipments;

    return shipments.filter((shipment) => shipment.status === statusFilter);
  }, [shipments, statusFilter]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shipments Dashboard</h1>
      <ShipmentsFilter value={statusFilter} onChange={setStatusFilter} />

      {loading && <div>Loading shipments...</div>}

      {!loading && loadError && (
        <div role="alert" className={styles.alert}>
          {loadError}
        </div>
      )}

      {!loading && !loadError && (
        <ShipmentsTable shipments={filteredShipments} />
      )}
    </div>
  );
}
