import type { ShipmentStatus } from "../../models/shipment";
import { ALL_STATUSES } from "../../models/shipment";

import styles from "./ShipmentsFilter.module.scss";

type Props = {
  value: ShipmentStatus | "All";
  onChange: (value: ShipmentStatus | "All") => void;
};

export function ShipmentsFilter({ value, onChange }: Props) {
  return (
    <label className={styles.filter}>
      Status:
      <select
        className={styles.select}
        aria-label="Filter by status"
        value={value}
        onChange={(e) => onChange(e.target.value as ShipmentStatus | "All")}
      >
        <option value="All">All</option>
        {ALL_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}
