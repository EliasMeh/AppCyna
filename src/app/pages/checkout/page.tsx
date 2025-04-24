'use client';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';

interface CartItem {
  id?: number;
  produitId?: number;
  productId?: number;
  quantite?: number;
  quantity?: number;
  produit?: {
    id: number;
    nom: string;
    prix: number;
    images: { url: string }[];
  };
  name?: string;
  price?: number;
}

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  adresse?: string;
}

interface StripeError {
  message: string;
  code: string;
}

interface CheckoutError {
  error: string;
  details: string;
  code: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<CheckoutError | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await fetch(`/api/cart?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCartItems(data);
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        setCartItems(guestCart);
      }
    } catch (error) {
      setError('Failed to load cart items');
      console.error('Error loading cart:', error);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = user ? item.produit?.prix : item.price;
      const quantity = user ? item.quantite : item.quantity;
      return total + (price || 0) * (quantity || 0);
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      if (!user) {
        setDetailedError({
          error: 'Authentication Required',
          details: 'Please log in to complete your purchase',
          code: 'AUTH_REQUIRED'
        });
        return;
      }

      if (!cartItems.length) {
        setDetailedError({
          error: 'Empty Cart',
          details: 'Your cart is empty',
          code: 'EMPTY_CART'
        });
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          userId: user.id,
          customerEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDetailedError({
          error: 'Checkout Failed',
          details: data.details || 'Failed to create checkout session',
          code: data.code || 'UNKNOWN_ERROR'
        });
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        setDetailedError({
          error: 'Stripe Error',
          details: stripeError.message || 'An unknown error occurred',
          code: 'STRIPE_REDIRECT_ERROR'
        });
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setDetailedError({
        error: 'System Error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: 'SYSTEM_ERROR'
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <main>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

        {detailedError && (
          <div className="mb-4 rounded bg-red-100 p-4">
            <h3 className="font-bold text-red-700">{detailedError.error}</h3>
            <p className="text-red-600">{detailedError.details}</p>
            {detailedError.code && (
              <p className="mt-2 text-xs text-gray-500">
                Error Code: {detailedError.code}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Summary */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            {cartItems.map((item) => (
              <div
                key={user ? item.id : item.productId}
                className="mb-4 flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h3 className="font-medium">
                    {user ? item.produit?.nom : item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {user ? item.quantite : item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    €
                    {(
                      ((user ? item.produit?.prix : item.price) ?? 0) *
                      (user ? item.quantite || 0 : item.quantity || 0)
                    ).toFixed(2)}
                    /month
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-4 text-right">
              <p className="text-lg font-bold">
                Total: €{calculateTotal().toFixed(2)}/month
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Customer Information</h2>
            {user ? (
              <div className="space-y-4">
                <p>
                  <span className="font-medium">Name:</span> {user.nom} {user.prenom}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{' '}
                  {user.adresse || 'No address provided'}
                </p>
              </div>
            ) : (
              <p className="text-red-600">Please log in to continue checkout</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={!user || cartItems.length === 0}
              className={`mt-6 w-full rounded-lg p-4 text-white ${
                user && cartItems.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
