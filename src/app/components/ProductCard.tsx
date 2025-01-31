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
    <main>
      <ImagePre id={productId} alt={`Image of ${productName}`} />
      <p>{productName}</p>
      <p>{productPrice}</p>
      <AddToCart />
    </main>
  );
};

export default ProductCard;