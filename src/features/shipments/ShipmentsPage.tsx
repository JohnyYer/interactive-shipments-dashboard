
import { ShipmentsTable } from "./ShipmentsTable";
import { ShipmentsFilter } from "./ShipmentsFilter";
import { QuickEditModal } from "./QuickEditModal";
import { useShipmentsDashboard } from "./hooks/useShipmentsDashboard";

import styles from "./ShipmentsPage.module.scss";

export function ShipmentsPage() {
  const {
    visibleShipments,
    loading,
    loadError,
    statusFilter,
    sort,
    isModalOpen,
    onToggleSort,
    onRowClick,
    closeModal,
    saveChanges,
    selectedShipment,
    setStatusFilter,
  } = useShipmentsDashboard();

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
          shipments={visibleShipments}
          onToggleSort={onToggleSort}
          sort={sort}
          onRowClick={onRowClick}
        />
      )}

      <QuickEditModal
        key={selectedShipment?.id ?? 'none'}
        open={isModalOpen}
        shipment={selectedShipment ?? null}
        onCancel={closeModal}
        onSave={saveChanges}
      />
    </div>
  );
}
