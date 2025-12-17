import { useEffect, useMemo, useState } from "react";
import { fetchShipments } from "../../api/shipmentsApi";
import type { Shipment, ShipmentStatus } from "../../models/shipment";
import { ShipmentsTable } from "./ShipmentsTable";

import styles from "./ShipmentsPage.module.scss";
import { ShipmentsFilter } from "./ShipmentsFilter";
import { applyStatusFilter } from "./utils";
import { applyShipmentSort, toggleSort, type SortState } from "./utils/sort";

export function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  //Filter state
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "All">(
    "All"
  );
  const [sort, setSort] = useState<SortState | null>(null);

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

  const shipmentsToDisplay = useMemo(() => {
    const filtered = applyStatusFilter(shipments, statusFilter);

    return applyShipmentSort(filtered, sort);
  }, [shipments, sort, statusFilter]);

  const onToggleSort = (field: "status" | "estimatedArrival") => {
    setSort((prev) => toggleSort(prev, field));
  };

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
        <ShipmentsTable
          shipments={shipmentsToDisplay}
          onToggleSort={onToggleSort}
          sort={sort}
        />
      )}
    </div>
  );
}
