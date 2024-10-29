import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';

export default function Header() {
  return (
    
    <header className="sticky top-0 z-50 bg-gray-800 text-white">
        <div>
            <Navbar className="flex items-center bg-white border-b-2 border-stone-400 shadow-lg p-4" isBordered>
                <NavbarBrand>
                <Image
                    src="/assets/cynalogo.png"
                    alt="cynaLogo"
                    width={75}
                    height={75}
                />
                <p className="font-bold text-inherit">Cyna</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link href="/" passHref>
                    <Button asChild>
                        <p>Home</p>
                    </Button>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/about" passHref>
                    <Button asChild>
                        <p>About</p>
                    </Button>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/contact" passHref>
                    <Button asChild>
                        <p>Contact</p>
                    </Button>
                    </Link>
                </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Button>
                        <Link href="/login">Login</Link>
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button>
                    Sign Up
                    </Button>
                </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    </header>
  );
}

