import { useEffect, useMemo, useState } from "react";
import { fetchShipments, updateShipment } from "../../api/shipmentsApi";
import type { Shipment, ShipmentStatus } from "../../models/shipment";
import { ShipmentsTable } from "./ShipmentsTable";

import styles from "./ShipmentsPage.module.scss";
import { ShipmentsFilter } from "./ShipmentsFilter";
import { applyShipmentSort, toggleSort, type SortState, type SortKey, applyStatusFilter } from "./utils";
import { QuickEditModal } from "./QuickEditModal";

export function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  //Filter state
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "All">(
    "All"
  );
  const [sort, setSort] = useState<SortState | null>(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);


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

  const onToggleSort = (field: SortKey) => {
    setSort((prev) => toggleSort(prev, field));
  };

  const selectedShipment = useMemo(() => {
    if (!selectedShipmentId) return null;
    return shipments.find((s) => s.id === selectedShipmentId) ?? null;
  }, [shipments, selectedShipmentId]);

  const onRowClick = (id: string) => {
    setSelectedShipmentId(id);
  };

  const closeModal = () => {
    setSelectedShipmentId(null);
  };

  const onSave = async (shipmentId: string, patch: Pick<Shipment, "destination" | "status">) => {
    const updated = await updateShipment(shipmentId, patch);

    setShipments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    closeModal();
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
          onRowClick={onRowClick}
        />
      )}

      <QuickEditModal
        key={selectedShipmentId ?? 'none'}
        open={!!selectedShipmentId}
        shipment={selectedShipment}
        onCancel={closeModal}
        onSave={onSave}
      />
    </div>
  );
}
