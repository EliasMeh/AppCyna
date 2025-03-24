'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Navbar, NavbarItem } from '@nextui-org/react';
import { Search, ShoppingBasket } from 'lucide-react';

interface User {
  id: number;
  email: string;
  nom: string;
  role: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
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
  }, []);

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
              <Link href="/pages/panier">
                <Button className="bg-white text-gray-800 rounded-full">
                  <ShoppingBasket />
                </Button>
              </Link>
            </div>
          </div>
        </Navbar>
      </div>
    </header>
  );
}