'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Navbar, NavbarItem } from '@nextui-org/react';
import { Search, ShoppingBasket, UserCircle, LogOut, Settings } from 'lucide-react';
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
    <header className="sticky top-0 z-50 rounded text-white">
      <div className="rounded-lg bg-customViolet p-2">
        <Navbar className="rounded-lg">
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
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                      <UserCircle className="h-6 w-6 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Welcome back,</p>
                      <p className="font-semibold text-white">{user.nom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => router.push('/pages/backoffice')}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20"
                    >
                      <Settings size={18} />
                      <span>Back Office</span>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                      <UserCircle className="h-6 w-6 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Welcome back,</p>
                      <p className="font-semibold text-white">{user.nom}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Button>
                </div>
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
              {user && (
                <Button
                  onClick={() => router.push('/pages/profile')}
                  className="mr-2 rounded-full bg-white text-gray-800"
                >
                  <UserCircle size={24} />
                </Button>
              )}
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
