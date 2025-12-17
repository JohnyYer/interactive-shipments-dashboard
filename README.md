# Interactive Shipments Dashboard

## Scripts

- `npm run dev` - Start the development server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Architecture & State Management

- ShipmentsPage acts as the feature entry point.
- useShipmentsDashboard encapsulates fetching, derived state, and update flows.
- Derived state (filter/sort) is implemented via selectors to avoid duplication.

## Styling

- SCSS Modules used for scoped, maintainable styles.
- No UI framework to keep focus on React logic.

## Testing Strategy

- Jest + React Testing Library for component-level integration tests.
- Unit tests for selectors (filter/sort composition).
- One hook test to validate async data fetching.

## Trade-offs

- **No external state managers** (Redux, Zustand, etc.) - The application's state needs are simple enough that React's built-in hooks (`useState`, `useEffect`) combined with custom hooks provide sufficient state management without the overhead of additional libraries.
- Context API not used to avoid unnecessary indirection.
- Modal state derived from selected shipment to prevent inconsistent UI.
