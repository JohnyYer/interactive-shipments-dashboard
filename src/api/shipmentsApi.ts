import type { Shipment, ShipmentStatus } from "../models/shipment";

const mockShipments: Shipment[] = [
  {
    id: "SHP-001",
    origin: "Port of Shanghai",
    destination: "Port of Rotterdam",
    status: "Booked",
    estimatedArrival: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "SHP-002",
    origin: "Port of Singapore",
    destination: "Port of Hamburg",
    status: "In Transit",
    estimatedArrival: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "SHP-003",
    origin: "Port of Los Angeles",
    destination: "Port of Antwerp",
    status: "Delivered",
    estimatedArrival: "2025-12-10T00:00:00.000Z",
  },
  {
    id: "SHP-004",
    origin: "Port of Busan",
    destination: "Port of Valencia",
    status: "Cancelled",
    estimatedArrival: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "SHP-005",
    origin: "Port of Ningbo",
    destination: "Port of Gdansk",
    status: "Booked",
    estimatedArrival: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "SHP-006",
    origin: "Port of Shenzhen",
    destination: "Port of Rotterdam",
    status: "In Transit",
    estimatedArrival: "2025-12-28T00:00:00.000Z",
  },
  {
    id: "SHP-007",
    origin: "Port of Santos",
    destination: "Port of Le Havre",
    status: "Delivered",
    estimatedArrival: "2025-11-30T00:00:00.000Z",
  },
  {
    id: "SHP-008",
    origin: "Port of Colombo",
    destination: "Port of Barcelona",
    status: "Booked",
    estimatedArrival: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "SHP-009",
    origin: "Port of Dubai",
    destination: "Port of Rotterdam",
    status: "In Transit",
    estimatedArrival: "2026-01-06T00:00:00.000Z",
  },
  {
    id: "SHP-010",
    origin: "Port of Tokyo",
    destination: "Port of Felixstowe",
    status: "Cancelled",
    estimatedArrival: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "SHP-011",
    origin: "Port of Mumbai",
    destination: "Port of Rotterdam",
    status: "Booked",
    estimatedArrival: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "SHP-012",
    origin: "Port of Vancouver",
    destination: "Port of Genoa",
    status: "Delivered",
    estimatedArrival: "2025-12-01T00:00:00.000Z",
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchShipments(): Promise<Shipment[]> {
  await sleep(400);

  return mockShipments.map((shipment) => ({ ...shipment }));
}

export async function updateShipment(
  shipmentId: string,
  data: Pick<Shipment, "destination" | "status">
): Promise<Shipment> {
  await sleep(1000 + Math.floor(Math.random() * 1000));

  const ok = Math.random() < 0.8;

  if (!ok) throw new Error("Network error: failed to update shipment. Please try again.");

  const existing = mockShipments.find((s) => s.id === shipmentId);
  if (!existing) throw new Error("Shipment not found.");

  existing.destination = data.destination;
  existing.status = data.status as ShipmentStatus;

  return { ...existing };
}


