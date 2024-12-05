import React from 'react';
import AddToCart from './AddToCart';

interface ProductCardProps {
  nom: string;
  prix: number;
  description: string;
}

export default function ProductCard({nom, prix, description}: ProductCardProps) {
  return (
    <div className='border-double border-4 border-black p-4 m-2 flex flex-col items-center'>
      <h1>ProductCard</h1>
      <h3>{nom}</h3>
      <h4>{prix} € HT</h4>
        <div>
          <AddToCart />
        </div>
    </div>
    
  )
}


