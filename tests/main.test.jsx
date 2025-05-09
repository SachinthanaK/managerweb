import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import { it, expect, describe } from "vitest";

describe("App Component", () => {
  it("renders the NavBar and RootLayout", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

    expect(screen.getByText(/welcome to the dashboard/i)).toBeInTheDocument();
  });

  it("renders the Orders page when navigating to /orders", () => {
    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/orders/i)).toBeInTheDocument();
  });

  it("renders the Products page when navigating to /products", async () => {
    render(
      <MemoryRouter initialEntries={["/products"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    const productsHeading = await screen.findByText(/products/i);
    expect(productsHeading).toBeInTheDocument();
  });

  it("renders the Customer Details page when navigating to /customers/:userId", () => {
    render(
      <MemoryRouter initialEntries={["/customers/123"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/customer details for/i)).toBeInTheDocument();
  });

  it("renders a 404 page for unmatched routes", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
