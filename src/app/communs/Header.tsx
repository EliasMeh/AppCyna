import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';

export default function Header() {
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
              
              <NavbarItem className="list-none">
                <Link href="/login" passHref>
                  <Button asChild>
                    <p>Login</p>
                  </Button>
                </Link>
              </NavbarItem>
              <NavbarItem className="list-none">
                <Link href="/signup" passHref>
                  <Button asChild>
                    <p>Sign Up</p>
                  </Button>
                </Link>
              </NavbarItem>
            </div>
            <div className="flex items-center">
              <Button className="bg-white text-gray-800 rounded-full">
                <Image
                  src="/assets/panierimg.png"
                  alt="Panier"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </div>
        </Navbar>
      </div>
    </header>
  );
}

