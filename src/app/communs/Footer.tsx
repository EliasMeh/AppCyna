import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ButtonBot from './ButtonBot';

export default function Footer() {
  return (
    <footer className="flex justify-center rounded-xl bg-customViolet p-4 text-white">
      <div className="mt-4 flex items-center space-x-1">
        <Link href="/pages/cgu" passHref>
          <Button>CGU</Button>
        </Link>

        <Link href="/pages/contact" passHref>
          <Button>Contact</Button>
        </Link>

        <Link
          href="https://fr.linkedin.com/company/cyna-it"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/Linkedin.png"
            alt="LinkedIn"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <div className="absolute bottom-4 right-4">
        <ButtonBot />
      </div>
    </footer>
  );
}
