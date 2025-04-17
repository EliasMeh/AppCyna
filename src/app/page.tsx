import React from 'react';
import Header from './communs/Header';
import Footer from './communs/Footer';
import Link from 'next/link';
import TextDyna from './components/TextDyna';
import { Button } from '../components/ui/button';
import Grille from './components/Grille';
import Carousel from './components/HomeComps/Carousel';
import GrilleCategorie from './components/HomeComps/GrilleCategorie';

export default function Home() {
  return (
    <main>
      <Header />
      <div className="pl-2">
        <h1>Page principale</h1>
        <Carousel />
        <TextDyna />
        <Grille />
        <GrilleCategorie />

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
          <Button variant="outline">Click Me</Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
