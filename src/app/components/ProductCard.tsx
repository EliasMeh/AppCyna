import React from 'react';
import AddToCart from './AddToCart';
import Image from './Image';

interface ProductCardProps {
  productId: string;
  productName: string;
  productPrice: number;
}

const ProductCard = ({ productName, productPrice, productId }: ProductCardProps) => {
  return (
    <main>
      <Image id={productId} />
      <p>{productName}</p>
      <p>{productPrice}</p>
      <AddToCart />
    </main>
  );
};
 
export default ProductCard;