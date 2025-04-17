'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Navbar, NavbarItem } from '@nextui-org/react';
import { Search, ShoppingBasket } from 'lucide-react';
import { CART_UPDATED_EVENT } from '@/lib/events';

interface User {
  id: number;
  email: string;
  nom: string;
  role: string;
}

interface CartItem {
  quantite?: number;
  quantity?: number;
}

interface LoggedInCartItem extends CartItem {
  quantite: number;
}

interface GuestCartItem extends CartItem {
  quantity: number;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (
          parsedUser &&
          typeof parsedUser.id === 'number' &&
          typeof parsedUser.email === 'string' &&
          typeof parsedUser.nom === 'string' &&
          typeof parsedUser.role === 'string'
        ) {
          setUser(parsedUser);
        } else {
          console.warn('Invalid user data structure in localStorage');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
    }
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // Logged in user - get count from API
        const user = JSON.parse(storedUser);
        const response = await fetch(`/api/cart?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        const cartItems = await response.json();
        // Sum up quantities of all items
        const totalCount = cartItems.reduce(
          (sum: number, item: LoggedInCartItem) => sum + (item.quantite || 0),
          0
        );
        setCartCount(totalCount);
      } else {
        // Guest user - get count from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        // Sum up quantities of all items
        const totalCount = guestCart.reduce(
          (sum: number, item: GuestCartItem) => sum + (item.quantity || 0),
          0
        );
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      if (!user) {
        updateCartCount();
      }
    };

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 rounded bg-red-700 text-white">
      <div className="rounded-lg bg-customViolet p-2">
        <Navbar isBordered className="rounded-lg">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Link href="/" passHref>
                <div className="flex cursor-pointer items-center">
                  <Image
                    src="/assets/cynalogo.png"
                    alt="cynaLogo"
                    width={50}
                    height={50}
                    className="mb-6 mt-6 rounded-full"
                  />
                  <h1 className="ml-2 text-2xl font-bold text-inherit">Cyna</h1>
                </div>
              </Link>
            </div>

            <div className="flex flex-1 justify-center gap-4">
              {user && user.role === 'ADMIN' ? (
                <>
                  <NavbarItem className="list-none">
                    <p className="font-semibold">Welcome, {user.nom}!</p>
                  </NavbarItem>
                  <NavbarItem className="list-none">
                    <Button onClick={handleLogout} className="bg-gray-700">
                      Logout
                    </Button>
                    <Button
                      onClick={() => router.push('/pages/backoffice')}
                      className="ml-2 bg-gray-700"
                    >
                      Back Office
                    </Button>
                  </NavbarItem>
                </>
              ) : user ? (
                <>
                  <NavbarItem className="list-none">
                    <p className="font-semibold">Welcome, {user.nom}!</p>
                  </NavbarItem>
                  <NavbarItem className="list-none">
                    <Button onClick={handleLogout} className="bg-gray-700">
                      Logout
                    </Button>
                  </NavbarItem>
                </>
              ) : (
                <>
                  <NavbarItem className="list-none">
                    <Link href="/users/connexion" passHref>
                      <Button asChild>
                        <p>Login</p>
                      </Button>
                    </Link>
                  </NavbarItem>
                  <NavbarItem className="list-none">
                    <Link href="/users/inscription" passHref>
                      <Button asChild>
                        <p>Sign Up</p>
                      </Button>
                    </Link>
                  </NavbarItem>
                </>
              )}
            </div>

            <div className="flex items-center">
              <Link href="/pages/recherche">
                <Button className="mr-1 rounded-full bg-white text-gray-800">
                  <Search size={24} />
                </Button>
              </Link>
              <Link href="/pages/cart">
                <Button className="relative rounded-full bg-white pl-2 pr-2 text-gray-800">
                  <ShoppingBasket />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </Navbar>
      </div>
    </header>
  );
}
