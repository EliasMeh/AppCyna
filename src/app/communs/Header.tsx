import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="p-4 bg-gray-800 text-white">
      <h1>Header start</h1>
      <nav>
        <Image
        src="/assets/cynalogo.png"
        alt="cynaLogo" 
        width={75}
        height={75}/>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" passHref>
              <Button asChild>
                <p>Home</p>
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/about" passHref>
              <Button asChild>
                <p>About</p>
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/contact" passHref>
              <Button asChild>
                <p>Contact</p>
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
      <h1>Header end</h1>
    </header>
  );
}

