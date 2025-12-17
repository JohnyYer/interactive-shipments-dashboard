import type { Shipment } from "../../../models/shipment";
import { applyStatusFilter, type StatusFilter } from "./filter";
import { applyShipmentSort, type SortState } from "./sort";

export function selectVisibleShipments(
    shipments: Shipment[],
    statusFilter: StatusFilter,
    sort: SortState | null
): Shipment[] {
    const filtered = applyStatusFilter(shipments, statusFilter);
    return applyShipmentSort(filtered, sort);
}

export function selectShipmentById(shipments: Shipment[], id: string | null): Shipment | null {
    if (!id) return null;
    return shipments.find((s) => s.id === id) ?? null;
}
