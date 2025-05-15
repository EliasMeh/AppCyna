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
        <br></br>
        <Carousel />
        <br></br>
        <TextDyna />
        <br></br>
        <Grille />
        <br></br>
        <GrilleCategorie />
      </div>
      <Footer />
    </main>
  );
}
