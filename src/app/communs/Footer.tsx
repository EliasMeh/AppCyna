import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="p-4 bg-gray-800 text-white rounded">

      <div className="flex space-x-4 mt-4 items-center">
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
        <Link href="https://www.github.com" target="_blank" rel="noopener noreferrer">
          <Image
            src="/assets/github-mark-white.png"
            alt="GitHub"
            width={50}
            height={50}
          />
        </Link>
      </div>
    </footer>
  );
}