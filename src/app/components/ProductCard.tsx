import React from 'react';
import Link from 'next/link';
import AddToCart from './AddToCart';
import ImagePre from './ImagePre';

interface ProductCardProps {
  productId: number;
  productName: string;
  productPrice: number;
  description?: string;
  stock: number; // Remove optional flag since it's required
}

const ProductCard = ({ 
  productName, 
  productPrice, 
  productId,
  description,
  stock
}: ProductCardProps) => {
  return (
    <div className='p-4 border border-gray-300 rounded-md m-4 hover:shadow-lg transition-shadow inline-block'>
      <Link href={`/pages/produit/${productId}`}>
        <div className='cursor-pointer'>
          <ImagePre 
            id={productId.toString()} 
            alt={`Image of ${productName}`} 
          />
          <div className='mt-2 space-y-1'>
            <h3 className='font-semibold text-lg'>{productName}</h3>
            <p className='font-bold text-xl'>{productPrice}€</p>
            {description && (
              <p className='text-sm text-gray-600 line-clamp-2'>{description}</p>
            )}
            <p className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>
      </Link>
      <div className='mt-4'>
        <AddToCart 
          productId={productId} 
          productName={productName} 
          productPrice={productPrice}
        />
      </div>
    </div>
  );
};

export default ProductCard;