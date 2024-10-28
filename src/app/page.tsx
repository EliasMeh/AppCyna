import React from 'react';
import Image from "next/image";
import Header from './communs/Header';
import Footer from './communs/Footer';
import ProductCard from './components/ProductCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main>
      <Header />
      <div>
        <h1>Hello World</h1>
        <ProductCard />
        <div>
          <Link href="/users">
            <button>Go to Users Page</button>
          </Link>
        </div>
        <div>
          <Button variant="outline">Click Me</Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
