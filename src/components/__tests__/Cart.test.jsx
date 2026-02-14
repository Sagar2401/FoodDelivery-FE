import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Cart from "../Cart";
import { CartProvider } from "../../contexts/CartContext";
import { AuthProvider } from "../../contexts/AuthContext"; // ✅ ADD THIS

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("Cart Component", () => {
  it("displays empty cart message when cart is empty", () => {
    localStorage.clear();
    renderWithProviders(<Cart />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("displays cart items when cart has items", () => {
    const cartWithItems = [
      {
        menuItemId: "1",
        name: "Pizza",
        price: 12.99,
        quantity: 2,
        image: "https://example.com/pizza.jpg",
      },
    ];

    localStorage.setItem("cart", JSON.stringify(cartWithItems));

    renderWithProviders(<Cart />);

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("$12.99 each")).toBeInTheDocument();
  });
});
