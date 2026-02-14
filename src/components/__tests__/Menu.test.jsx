import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Menu from '../Menu';
import { CartProvider } from '../../contexts/CartContext';
import { menuService } from '../../services/api';

vi.mock('../../services/api');

describe('Menu Component', () => {
  it('renders menu items', async () => {
    const mockMenuItems = [
      {
        _id: '1',
        name: 'Pizza',
        description: 'Delicious pizza',
        price: 12.99,
        image: 'https://example.com/pizza.jpg',
      },
      {
        _id: '2',
        name: 'Burger',
        description: 'Tasty burger',
        price: 8.99,
        image: 'https://example.com/burger.jpg',
      },
    ];

    menuService.getAll.mockResolvedValue({ data: mockMenuItems });

    render(
      <CartProvider>
        <Menu />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Burger')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    menuService.getAll.mockImplementation(() => new Promise(() => {}));

    render(
      <CartProvider>
        <Menu />
      </CartProvider>
    );

    expect(screen.getByText('Loading menu...')).toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    menuService.getAll.mockRejectedValue(new Error('Network error'));

    render(
      <CartProvider>
        <Menu />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
