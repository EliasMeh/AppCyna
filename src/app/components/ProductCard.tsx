import React from 'react';
import AddToCart from './AddToCart';
import ImagePre from './ImagePre';

interface ProductCardProps {
  productId: string;
  productName: string;
  productPrice: number;
}

const ProductCard = ({ productName, productPrice, productId }: ProductCardProps) => {
  return (
    <main className='p-4 border border-gray-300 rounded-md inline-block m-4'>
      <ImagePre id={productId} alt={`Image of ${productName}`} />
      <p className='mt-2'>{productName}</p>
      <p className='font-bold'>{productPrice}€</p>
      <AddToCart />
    </main>
  );
};

export default ProductCard;