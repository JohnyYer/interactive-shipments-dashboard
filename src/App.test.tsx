import { render, screen } from "@testing-library/react";
import TestPage from "./App";

describe("TestPage", () => {
  it("renders the page title", () => {
    render(<TestPage />);
    expect(screen.getByText("Initial page")).toBeInTheDocument();
  });
});
