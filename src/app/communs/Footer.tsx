import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
        <Link href="/cgu">
            <button>CGU</button>
        </Link>
    </footer>
  );
}