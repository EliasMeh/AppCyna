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
  stock,
}: ProductCardProps) => {
  return (
    <div className="m-4 inline-block rounded-md border border-gray-300 p-4 transition-shadow hover:shadow-lg">
      <Link href={`/pages/produit/${productId}`}>
        <div className="cursor-pointer">
          <ImagePre id={productId.toString()} alt={`Image of ${productName}`} />
          <div className="mt-2 space-y-1">
            <h3 className="text-lg font-semibold">{productName}</h3>
            <p className="text-xl font-bold">{productPrice}€</p>
            {description && (
              <p className="line-clamp-2 text-sm text-gray-600">
                {description}
              </p>
            )}
            <p
              className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}
            >
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-4">
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
