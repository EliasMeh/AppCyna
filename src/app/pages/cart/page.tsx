'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImagePre from '@/app/components/ImagePre';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';
import { triggerCartUpdate } from '@/lib/events';

// Update the CartItem interface to properly type the database structure
interface CartItem {
  id?: number;
  productId?: number; // For guest cart
  produitId?: number; // For logged-in users
  name?: string;
  price?: number;
  quantite?: number; // For database items
  quantity?: number; // For guest cart
  produit?: {
    id: number;
    nom: string;
    prix: number;
    images: { url: string }[]; // Replace with the actual structure of ProductImage if known
  };
}

interface User {
  id: number;
  email: string;
  nom: string;
  role: string;
}

// Add a new interface for product totals
interface ProductTotals {
  [key: string]: number;
}

// Update the helper function
const sortCartItems = (items: CartItem[], isLoggedIn: boolean): CartItem[] => {
  return [...items].sort((a, b) => {
    const nameA = isLoggedIn ? a.produit?.nom || '' : a.name || '';
    const nameB = isLoggedIn ? b.produit?.nom || '' : b.name || '';

    // First compare by name
    const nameComparison = nameA.localeCompare(nameB);

    // If names are the same, compare by total price
    if (nameComparison === 0) {
      const totalPriceA =
        (isLoggedIn ? a.produit?.prix || 0 : a.price || 0) *
        (isLoggedIn ? a.quantite || 0 : a.quantity || 0);
      const totalPriceB =
        (isLoggedIn ? b.produit?.prix || 0 : b.price || 0) *
        (isLoggedIn ? b.quantite || 0 : b.quantity || 0);
      return totalPriceB - totalPriceA; // Sort by price in descending order
    }

    return nameComparison;
  });
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productTotals, setProductTotals] = useState<ProductTotals>({});
  const [cartTotal, setCartTotal] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Logged in user - fetch from API
      const user = JSON.parse(storedUser);
      try {
        const response = await fetch(`/api/cart?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCartItems(data);

        const initialTotals: ProductTotals = {};
        const total = data.reduce((sum: number, item: CartItem) => {
          const itemTotal =
            (user ? (item.produit?.prix ?? 0) : (item.price ?? 0)) *
            (user ? (item.quantite ?? 0) : (item.quantity ?? 0));
          initialTotals[
            user
              ? (item.id?.toString() ?? '')
              : (item.productId?.toString() ?? '')
          ] = itemTotal;
          return sum + itemTotal;
        }, 0);

        setProductTotals(initialTotals);
        setCartTotal(total);
      } catch (error) {
        console.error('Error loading cart:', error);
        alert('Failed to load cart items');
      }
    } else {
      // Guest user - load from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartItems(guestCart);

      const initialTotals: ProductTotals = {};
      const total = guestCart.reduce((sum: number, item: CartItem) => {
        const itemTotal = (item.price ?? 0) * (item.quantity ?? 0);
        initialTotals[item.productId?.toString() ?? ''] = itemTotal;
        return sum + itemTotal;
      }, 0);

      setProductTotals(initialTotals);
      setCartTotal(total);
    }
    setIsLoading(false);
  };

  const updateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;

    if (user) {
      try {
        const response = await fetch(
          `/api/cart?cartItemId=${item.id}&quantite=${newQuantity}`,
          {
            method: 'PUT',
          }
        );
        const data = await response.json();

        if (!response.ok) {
          alert(data.error || 'Failed to update quantity');
          return;
        }

        // Update cart items with new quantity
        const updatedCartItems = cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantite: newQuantity }
            : cartItem
        );
        setCartItems(updatedCartItems);

        // Update product total
        const itemPrice = item.produit?.prix ?? 0;
        const itemId = item.id?.toString() ?? '';
        setProductTotals((prev) => ({
          ...prev,
          [itemId]: itemPrice * newQuantity,
        }));

        // Update cart total
        const newTotal = updatedCartItems.reduce(
          (total, item) =>
            total + (item.produit?.prix ?? 0) * (item.quantite ?? 0),
          0
        );
        setCartTotal(newTotal);
        triggerCartUpdate();
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
      }
    } else {
      // Guest user - update localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updatedCart = guestCart.map((cartItem: CartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );

      // Update localStorage
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));

      // Update cart items state
      setCartItems(updatedCart);

      // Update product total
      const itemPrice = item.price ?? 0;
      const itemId = item.productId?.toString() ?? '';
      setProductTotals((prev) => ({
        ...prev,
        [itemId]: itemPrice * newQuantity,
      }));

      // Update cart total
      const newTotal: number = updatedCart.reduce(
        (total: number, item: CartItem) =>
          total + (item.price ?? 0) * (item.quantity ?? 0),
        0
      );
      setCartTotal(newTotal);
      triggerCartUpdate();
    }
  };

  const removeItem = async (item: CartItem) => {
    if (user) {
      // Logged in user - update via API
      try {
        const response = await fetch(`/api/cart?cartItemId=${item.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to remove item');
        loadCartItems();
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item');
      }
    } else {
      // Guest user - update localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updatedCart = guestCart.filter(
        (cartItem: CartItem) => cartItem.productId !== item.productId
      );
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = user ? item.produit?.prix : item.price;
      const quantity = user ? item.quantite : item.quantity;
      return total + (price || 0) * (quantity || 0);
    }, 0);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <main>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-gray-600">Your cart is empty</p>
            <Link href="/" className="text-blue-500 hover:text-blue-600">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortCartItems(cartItems, !!user).map((item) => (
              <div
                key={user ? item.id : item.productId}
                className="flex items-center rounded-lg border p-4"
              >
                {/* Image container with fixed dimensions and proper styling */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <ImagePre
                    id={
                      (user ? item.produit?.id : item.productId)?.toString() ||
                      ''
                    }
                    alt={user ? item.produit?.nom || '' : item.name || ''}
                  />
                </div>

                {/* Rest of the item details */}
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold">
                    {user ? item.produit?.nom : item.name}
                  </h3>
                  <p className="text-gray-600">
                    Price: €{user ? item.produit?.prix : item.price}
                  </p>
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item,
                          (user ? (item.quantite ?? 0) : (item.quantity ?? 0)) -
                            1
                        )
                      }
                      className="rounded bg-gray-200 px-2 py-1"
                    >
                      -
                    </button>
                    <span className="mx-4">
                      {user ? item.quantite : item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item,
                          (user ? (item.quantite ?? 0) : (item.quantity ?? 0)) +
                            1
                        )
                      }
                      className="rounded bg-gray-200 px-2 py-1"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item)}
                      className="ml-4 text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-bold">
                  €
                  {productTotals[
                    user
                      ? (item.id?.toString() ?? '')
                      : (item.productId?.toString() ?? '')
                  ] ??
                    (user ? (item.produit?.prix ?? 0) : (item.price ?? 0)) *
                      (user ? (item.quantite ?? 0) : (item.quantity ?? 0))}
                </div>
              </div>
            ))}

            <div className="mt-6 text-right">
              <div className="text-xl font-bold">
                Total: €{cartTotal.toFixed(2)}
              </div>
              <button
                onClick={() => router.push('/pages/checkout')}
                className="mt-4 rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
