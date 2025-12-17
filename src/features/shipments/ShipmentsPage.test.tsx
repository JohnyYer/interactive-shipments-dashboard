import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShipmentsPage } from "./ShipmentsPage";
import type { Shipment } from "../../models/shipment";
import * as api from "../../api/shipmentsApi";

jest.mock("../../api/shipmentsApi", () => ({
    fetchShipments: jest.fn(),
    updateShipment: jest.fn(),
}));

const mockFetchShipments = api.fetchShipments as jest.MockedFunction<typeof api.fetchShipments>;
const mockUpdateShipment = api.updateShipment as jest.MockedFunction<typeof api.updateShipment>;

const fixtures: Shipment[] = [
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
        status: "Delivered",
        estimatedArrival: "2026-01-03T00:00:00.000Z",
    },
    {
        id: "SHP-003",
        origin: "Port of Tokyo",
        destination: "Port of Antwerp",
        status: "In Transit",
        estimatedArrival: "2026-01-20T00:00:00.000Z",
    },
];

function getBodyRows() {
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    return rows.slice(1);
}

describe("ShipmentsPage", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockFetchShipments.mockResolvedValue(fixtures);
    });

    it("renders shipments after fetch", async () => {
        render(<ShipmentsPage />);

        // Wait until a known shipment appears
        expect(await screen.findByText("SHP-001")).toBeInTheDocument();

        const rows = getBodyRows();
        expect(rows).toHaveLength(fixtures.length);
    });

    it("filters shipments by status", async () => {
        const user = userEvent.setup();
        render(<ShipmentsPage />);

        await screen.findByText("SHP-001");

        const select = screen.getByRole("combobox", { name: /filter by status/i });
        await user.selectOptions(select, "Delivered");

        const rows = getBodyRows();
        expect(rows).toHaveLength(1);

        expect(screen.getByText("SHP-002")).toBeInTheDocument();
        expect(screen.queryByText("SHP-001")).not.toBeInTheDocument();
        expect(screen.queryByText("SHP-003")).not.toBeInTheDocument();
    });

    it("sorts by estimatedArrival and toggles direction on subsequent clicks", async () => {
        const user = userEvent.setup();
        render(<ShipmentsPage />);

        await screen.findByText("SHP-001");

        const sortHeader = screen.getByRole("columnheader", { name: /estimated arrival/i });

        // First click: ascending by date (earliest first)
        await user.click(sortHeader);

        let rows = getBodyRows();
        expect(within(rows[0]).getByText("SHP-002")).toBeInTheDocument(); // 2026-01-03
        expect(within(rows[1]).getByText("SHP-001")).toBeInTheDocument(); // 2026-01-10
        expect(within(rows[2]).getByText("SHP-003")).toBeInTheDocument(); // 2026-01-20

        // Second click: descending by date (latest first)
        await user.click(sortHeader);

        rows = getBodyRows();
        expect(within(rows[0]).getByText("SHP-003")).toBeInTheDocument();
        expect(within(rows[1]).getByText("SHP-001")).toBeInTheDocument();
        expect(within(rows[2]).getByText("SHP-002")).toBeInTheDocument();
    });

    it("opens the quick edit modal when clicking a row and pre-fills fields", async () => {
        const user = userEvent.setup();
        render(<ShipmentsPage />);

        await screen.findByText("SHP-001");

        await user.click(screen.getByText("SHP-001"));

        const dialog = screen.getByRole("dialog", { name: /quick edit shipment/i });
        expect(dialog).toBeInTheDocument();

        expect(screen.getByDisplayValue("Port of Rotterdam")).toBeInTheDocument();

        const statusSelect = within(dialog).getByLabelText(/status/i) as HTMLSelectElement;
        expect(statusSelect.value).toBe("Booked");
    });

    it("saves changes successfully: closes modal and updates table", async () => {
        const user = userEvent.setup();

        const updated: Shipment = {
            ...fixtures[0],
            destination: "Port of Gdansk",
            status: "Cancelled",
        };
        mockUpdateShipment.mockResolvedValue(updated);

        render(<ShipmentsPage />);
        await screen.findByText("SHP-001");

        await user.click(screen.getByText("SHP-001"));

        const dialog = screen.getByRole("dialog", { name: /quick edit shipment/i });

        // edit destination + status
        const destinationInput = within(dialog).getByLabelText("Destination");
        await user.clear(destinationInput);
        await user.type(destinationInput, "Port of Gdansk");

        await user.selectOptions(within(dialog).getByLabelText("Status"), "Cancelled");

        await user.click(within(dialog).getByRole("button", { name: "Save Changes" }));

        // modal closes
        expect(screen.queryByRole("dialog", { name: "Quick Edit Shipment" })).not.toBeInTheDocument();

        // table reflects updated values
        const table = screen.getByRole("table");
        expect(within(table).getByText("Port of Gdansk")).toBeInTheDocument();
        expect(within(table).getByText("Cancelled")).toBeInTheDocument();

        expect(mockUpdateShipment).toHaveBeenCalledWith("SHP-001", {
            destination: "Port of Gdansk",
            status: "Cancelled",
        });
    });

    it("shows an error and keeps modal open when save fails", async () => {
        const user = userEvent.setup();

        mockUpdateShipment.mockRejectedValue(new Error("Boom"));

        render(<ShipmentsPage />);
        await screen.findByText("SHP-001");

        await user.click(screen.getByText("SHP-001"));

        await user.click(screen.getByRole("button", { name: "Save Changes" }));

        // modal stays open
        expect(screen.getByRole("dialog", { name: "Quick Edit Shipment" })).toBeInTheDocument();

        // error appears
        expect(await screen.findByRole("alert")).toHaveTextContent("Boom");
    });
});
