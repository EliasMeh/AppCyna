'use client'
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

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && 
            typeof parsedUser.id === 'number' && 
            typeof parsedUser.email === 'string' &&
            typeof parsedUser.nom === 'string' &&
            typeof parsedUser.role === 'string') {
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
        const totalCount = cartItems.reduce((sum: number, item: any) => sum + (item.quantite || 0), 0);
        setCartCount(totalCount);
      } else {
        // Guest user - get count from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        // Sum up quantities of all items
        const totalCount = guestCart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
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
    <header className="sticky top-0 z-50 bg-red-700 text-white rounded">
      <div className="bg-customViolet rounded-lg p-2">
        <Navbar isBordered className="rounded-lg">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Link href="/" passHref>
                <div className="flex items-center cursor-pointer">
                  <Image
                    src="/assets/cynalogo.png"
                    alt="cynaLogo"
                    width={50}
                    height={50}
                    className="rounded-full mt-6 mb-6"
                  />
                  <h1 className="font-bold text-inherit ml-2 text-2xl">Cyna</h1>
                </div>
              </Link>
            </div>

            <div className="flex-1 flex justify-center gap-4">
              {user && user.role === "ADMIN" ? (
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
                      className="bg-gray-700 ml-2"
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
                <Button className="bg-white text-gray-800 rounded-full mr-1">
                  <Search size={24} />
                </Button>
              </Link>
              <Link href="/pages/cart">
                <Button className="bg-white text-gray-800 rounded-full relative pr-2 pl-2">
                  <ShoppingBasket />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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