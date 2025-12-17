import type { Shipment } from "../../../models/shipment";
import { selectShipmentById, selectVisibleShipments } from "./selectors";
import type { StatusFilter } from "./filter";
import type { SortState } from "./sort";

const shipments: Shipment[] = [
    { id: "SHP-1", origin: "A", destination: "X", status: "Delivered", estimatedArrival: "2026-01-03T00:00:00.000Z" },
    { id: "SHP-2", origin: "B", destination: "Y", status: "Booked", estimatedArrival: "2026-01-10T00:00:00.000Z" },
    { id: "SHP-3", origin: "C", destination: "Z", status: "Delivered", estimatedArrival: "2026-01-20T00:00:00.000Z" },
];

describe("shipments selectors", () => {
    it("selectShipmentById returns null when id is null", () => {
        expect(selectShipmentById(shipments, null)).toBeNull();
    });

    it("selectShipmentById returns the matching shipment", () => {
        expect(selectShipmentById(shipments, "SHP-2")?.destination).toBe("Y");
    });

    it("selectVisibleShipments filters by status", () => {
        const filter: StatusFilter = "Delivered";
        const sort: SortState | null = null;

        const result = selectVisibleShipments(shipments, filter, sort);
        expect(result.map((s) => s.id)).toEqual(["SHP-1", "SHP-3"]);
    });

    it("selectVisibleShipments sorts by estimatedArrival asc", () => {
        const filter: StatusFilter = "All";
        const sort: SortState = { key: "estimatedArrival", direction: "asc" };

        const result = selectVisibleShipments(shipments, filter, sort);
        expect(result.map((s) => s.id)).toEqual(["SHP-1", "SHP-2", "SHP-3"]);
    });

    it("selectVisibleShipments sorts by estimatedArrival desc", () => {
        const filter: StatusFilter = "All";
        const sort: SortState = { key: "estimatedArrival", direction: "desc" };

        const result = selectVisibleShipments(shipments, filter, sort);
        expect(result.map((s) => s.id)).toEqual(["SHP-3", "SHP-2", "SHP-1"]);
    });

    it("does not mutate the input array", () => {
        const filter: StatusFilter = "All";
        const sort: SortState = { key: "estimatedArrival", direction: "asc" };

        const original = [...shipments];
        selectVisibleShipments(shipments, filter, sort);

        expect(shipments).toEqual(original);
    });
});
