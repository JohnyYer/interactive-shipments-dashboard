import type { Shipment, ShipmentStatus } from "../../../models/shipment";

export type StatusFilter = ShipmentStatus | "All";

export function applyStatusFilter(
  shipments: Shipment[],
  statusFilter: StatusFilter
): Shipment[] {
  if (statusFilter === "All") return shipments;

  return shipments.filter((s) => s.status === statusFilter);
}
