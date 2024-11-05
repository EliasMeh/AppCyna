import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="p-4 bg-customViolet text-white rounded-xl">

      <div className="flex space-x-1 mt-4 items-center">
        <Link href="/cgu" passHref>
          <Button>CGU</Button>
        </Link>
        <Link href="/mentionleg" passHref>
          <Button>Mentions Légales</Button>
        </Link>
        <Link href="/contact" passHref>
          <Button>Contact</Button>
        </Link>
        <Link href="https://fr.linkedin.com/company/cyna-it" target="_blank" rel="noopener noreferrer">
          <Image
            src="/assets/Linkedin.png"
            alt="LinkedIn"
            width={50}
            height={50}
          />
        </Link>
        
      </div>
    </footer>
  );
}