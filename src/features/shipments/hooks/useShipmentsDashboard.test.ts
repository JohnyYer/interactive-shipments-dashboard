import { renderHook, waitFor } from "@testing-library/react";
import * as api from "../../../api/shipmentsApi";
import { useShipmentsDashboard } from "./useShipmentsDashboard";
import type { Shipment } from "../../../models/shipment";

jest.mock("../../../api/shipmentsApi", () => ({
    fetchShipments: jest.fn(),
    updateShipment: jest.fn(),
}));

const mockFetchShipments = api.fetchShipments as jest.MockedFunction<typeof api.fetchShipments>;

const fixtures: Shipment[] = [
    { id: "SHP-1", origin: "A", destination: "X", status: "Booked", estimatedArrival: "2026-01-10T00:00:00.000Z" },
];

describe("useShipmentsDashboard", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("fetches shipments on mount and exposes derived data", async () => {
        mockFetchShipments.mockResolvedValue(fixtures);

        const { result } = renderHook(() => useShipmentsDashboard());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(mockFetchShipments).toHaveBeenCalledTimes(1);
        expect(result.current.visibleShipments).toHaveLength(1);
        expect(result.current.visibleShipments[0].id).toBe("SHP-1");
    });
});
