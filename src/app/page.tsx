import React from 'react';
import Header from './communs/Header';
import Footer from './communs/Footer';
import Link from 'next/link';
import TextDyna from './components/TextDyna';
import { Button } from '../components/ui/button';
import Grille from './components/Grille';

export default function Home() {
  return (
    <main>
      <Header />
      <div>
        <h1>Page principale</h1>
        <p>Texte dynamique : </p>
        <TextDyna />
        <Grille />
        
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>

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
