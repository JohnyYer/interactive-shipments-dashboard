import type { Shipment } from "../../models/shipment";

import styles from "./ShipmentsTable.module.scss";
import type { SortState } from "./utils/sort";

type Props = {
  shipments: Shipment[];
  onToggleSort: (field: "status" | "estimatedArrival") => void;
  sort: SortState | null;
  onRowClick: (id: string) => void;
};

export function ShipmentsTable({ shipments, onToggleSort, sort, onRowClick }: Props) {
  return (
    <table role="table" className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>ID</th>
          <th className={styles.headerCell}>Origin</th>
          <th className={styles.headerCell}>Destination</th>

          <th
            className={styles.headerCellClickable}
            onClick={() => onToggleSort("status")}
          >
            Status
            {sort?.key === "status" && (
              <span className={styles.sortIndicator}>
                {sort.direction === "asc" ? "▲" : "▼"}
              </span>
            )}
          </th>

          <th
            className={styles.headerCellClickable}
            onClick={() => onToggleSort("estimatedArrival")}
          >
            Estimated Arrival
            {sort?.key === "estimatedArrival" && (
              <span className={styles.sortIndicator}>
                {sort.direction === "asc" ? "▲" : "▼"}
              </span>
            )}
          </th>
        </tr>
      </thead>

      <tbody>
        {shipments.map((s) => (
          <tr
            key={s.id}
            onClick={() => onRowClick(s.id)}
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
