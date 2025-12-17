import {
 useEffect, useMemo, useState 
} from "react";
import { fetchShipments, updateShipment } from "../../../api/shipmentsApi";
import type { Shipment } from "../../../models/shipment";
import {
 selectVisibleShipments, selectShipmentById, toggleSort, type SortKey, type SortState, type StatusFilter 
} from "../utils";

export function useShipmentsDashboard() {
    // server state
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // UI state
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
    const [sort, setSort] = useState<SortState | null>(null);
    const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const data = await fetchShipments();
                if (!cancelled) setShipments(data);
            } catch (err) {
                if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load shipments");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const visibleShipments = useMemo(
        () => selectVisibleShipments(shipments, statusFilter, sort),
        [shipments, statusFilter, sort]
    );

    const selectedShipment = useMemo(
        () => selectShipmentById(shipments, selectedShipmentId),
        [shipments, selectedShipmentId]
    );

    const isModalOpen = selectedShipmentId !== null;

    const onToggleSort = (key: SortKey) => setSort((prev: SortState | null) => toggleSort(prev, key));
    const onRowClick = (id: string) => setSelectedShipmentId(id);
    const closeModal = () => setSelectedShipmentId(null);

    const saveChanges = async (
        shipmentId: string,
        patch: Pick<Shipment, "destination" | "status">
    ) => {
        const updated = await updateShipment(shipmentId, patch);
        setShipments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        closeModal();
    };

    return {
        visibleShipments,
        selectedShipment,
        loading,
        loadError,
        statusFilter,
        sort,
        isModalOpen,

        // actions
        setStatusFilter,
        onToggleSort,
        onRowClick,
        closeModal,
        saveChanges,
    };
}
