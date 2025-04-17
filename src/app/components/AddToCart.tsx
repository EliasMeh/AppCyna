'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { triggerCartUpdate } from '@/lib/events';

interface AddToCartProps {
  productId: number;
  productName: string;
  productPrice: number;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface User {
  id: number;
  email: string;
  nom: string;
  role: string;
}

const AddToCart = ({
  productId,
  productName,
  productPrice,
}: AddToCartProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const addToCart = async () => {
    setIsLoading(true);

    if (user?.id) {
      try {
        console.log('Adding to cart:', {
          userId: user.id,
          productId,
          quantite: 1,
        });

        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            produitId: productId,
            quantite: 1,
          }),
        });

        const data = await response.json();
        console.log('Cart response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to add to cart');
        }

        router.refresh();
        alert('Product added to cart!');
        triggerCartUpdate();
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart');
      }
    } else {
      // Handle guest user with localStorage
      const existingCart = JSON.parse(
        localStorage.getItem('guestCart') || '[]'
      ) as CartItem[];

      const existingItem = existingCart.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        existingCart.push({
          productId,
          name: productName,
          price: productPrice,
          quantity: 1,
        });
      }

      localStorage.setItem('guestCart', JSON.stringify(existingCart));
      alert('Product added to cart! (Guest mode)');
      triggerCartUpdate();
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={addToCart}
      disabled={isLoading}
      className={`w-full rounded-md px-4 py-2 font-medium text-white ${
        isLoading
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
      } transition-colors duration-200`}
    >
      {isLoading ? 'Adding...' : 'Add to cart'}
    </button>
  );
};

export default AddToCart;
