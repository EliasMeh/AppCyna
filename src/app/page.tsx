import React from 'react';
import Header from './communs/Header';
import Footer from './communs/Footer';
import ProductCard from './products/ProductCard';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import prisma from '../lib/prisma';

async function getProduits() {
  const produits = await prisma.produit.findMany();
  return produits;
}

export default async function Home() {
  const produits = await getProduits();
  console.log(produits);
    return (
    <main>

      <Header />
      <div>
        <h1>Produits</h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {
          produits.map((produit) => {
            return (
              <ProductCard 
              key={produit.id}
              nom={produit.nom} 
              prix={produit.prix} 
              description={produit.description}/>
            )
          })
        }
      </div>
      <Footer />
    </main>
  );
}
