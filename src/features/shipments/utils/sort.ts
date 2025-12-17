import type { Shipment } from "../../../models/shipment";

export type SortKey = "status" | "estimatedArrival";
export type SortDirection = "asc" | "desc";

export type SortState = {
  key: SortKey;
  direction: SortDirection;
};

export function toggleSort(prev: SortState | null, key: SortKey): SortState {
  if (!prev || prev.key !== key) return { key, direction: "asc" };
  return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
}

export function applyShipmentSort(
  shipments: Shipment[],
  sort: SortState | null
): Shipment[] {
  if (!sort) return shipments;

  const sorted = [...shipments].sort((a, b) => {
    if (sort.key === "status") {
      return a.status.localeCompare(b.status);
    }

    const aTime = new Date(a.estimatedArrival).getTime();
    const bTime = new Date(b.estimatedArrival).getTime();
    return aTime - bTime;
  });

  return sort.direction === "asc" ? sorted : sorted.reverse();
}
