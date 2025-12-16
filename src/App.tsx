import { useEffect, useState } from "react";
import { fetchShipments } from "./api/shipmentsApi";
import type { Shipment } from "./models/shipment";

function App() {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    fetchShipments().then(setShipments);
  }, []);

  return (
    <div className="app">
      Initial page
      <pre>{JSON.stringify(shipments, null, 2)}</pre>
    </div>
  );
}

export default App;
