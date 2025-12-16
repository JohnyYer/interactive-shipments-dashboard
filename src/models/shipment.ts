export type ShipmentStatus =
  | "Booked"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  estimatedArrival: string;
}

export const ALL_STATUSES: ShipmentStatus[] = [
  "Booked",
  "In Transit",
  "Delivered",
  "Cancelled",
];
