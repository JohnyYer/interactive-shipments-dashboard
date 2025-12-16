import type { Shipment } from "../../models/shipment";

import styles from "./ShipmentsTable.module.scss";

type Props = {
  shipments: Shipment[];
};

export function ShipmentsTable({ shipments }: Props) {
  return (
    <table role="table" className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>ID</th>
          <th className={styles.headerCell}>Origin</th>
          <th className={styles.headerCell}>Destination</th>

          <th className={styles.headerCell}>
            <button type="button" onClick={() => console.log("Sorting status")}>
              Status
            </button>
          </th>

          <th className={styles.headerCell}>
            <button
              type="button"
              onClick={() => console.log("Sorting estimated arrival")}
            >
              Estimated Arrival
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        {shipments.map((s) => (
          <tr
            key={s.id}
            onClick={() => console.log("Row clicked", s.id)}
            className={styles.row}
          >
            <td className={styles.cell}>{s.id}</td>
            <td className={styles.cell}>{s.origin}</td>
            <td className={styles.cell}>{s.destination}</td>
            <td className={styles.cell}>{s.status}</td>
            <td className={styles.cell}>
              {new Date(s.estimatedArrival).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
