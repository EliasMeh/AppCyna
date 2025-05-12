'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingBasket, UserCircle, LogOut, Settings } from 'lucide-react';
import { CART_UPDATED_EVENT } from '@/lib/events';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
          localStorage.removeItem('user');
        }
      }
    } catch {
      localStorage.removeItem('user');
    }
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await fetch(`/api/cart?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        const cartItems = await response.json();
        const totalCount = cartItems.reduce(
          (sum: number, item: LoggedInCartItem) => sum + (item.quantite || 0),
          0
        );
        setCartCount(totalCount);
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const totalCount = guestCart.reduce(
          (sum: number, item: GuestCartItem) => sum + (item.quantity || 0),
          0
        );
        setCartCount(totalCount);
      }
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-customViolet text-white">
      <nav className="flex items-center justify-between p-4">
        {/* Logo and name */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/cynalogo.png" alt="cynaLogo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold">Cyna</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-4">
          {!user ? (
            <>
              <Link href="/users/connexion"><Button variant="ghost">Login</Button></Link>
              <Link href="/users/inscription"><Button variant="ghost">Sign Up</Button></Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="font-semibold">Welcome, {user.nom}</span>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              {user.role === 'ADMIN' && (
                <Button variant="ghost" onClick={() => router.push('/pages/backoffice')}>
                  <Settings size={18} className="mr-1" /> Back Office
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2">
          {user && (
            <Button onClick={() => router.push('/pages/profile')} className="rounded-full bg-white text-gray-800">
              <UserCircle size={20} />
            </Button>
          )}
          <Link href="/pages/cart">
            <Button className="relative rounded-full bg-white text-gray-800">
              <ShoppingBasket size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px] bg-customViolet text-white">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {!user ? (
                  <>
                    <Link href="/users/connexion"><Button variant="ghost">Login</Button></Link>
                    <Link href="/users/inscription"><Button variant="ghost">Sign Up</Button></Link>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">{user.nom}</span>
                    <Button variant="ghost" onClick={() => router.push('/pages/profile')}>Profile</Button>
                    {user.role === 'ADMIN' && (
                      <Button variant="ghost" onClick={() => router.push('/pages/backoffice')}>
                        Back Office
                      </Button>
                    )}
                    <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                  </>
                )}
                <Link href="/pages/cart">
                  <Button variant="ghost">
                    Cart ({cartCount})
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}