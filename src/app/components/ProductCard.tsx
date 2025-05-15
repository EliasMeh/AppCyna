import React from 'react';
import Link from 'next/link';
import AddToCart from './AddToCart';
import ImagePre from './ImagePre';

interface ProductCardProps {
  productId: number;
  productName: string;
  productPrice: number;
  stock: number;
}

const ProductCard = ({
  productId,
  productName,
  productPrice,
  stock,
}: ProductCardProps) => {
  return (
    <div className="w-full rounded-md border border-gray-300 bg-white p-3 transition-shadow hover:shadow-md">
      <Link href={`/pages/produit/${productId}`}>
        <div className="cursor-pointer">
          {/* Image container with fixed aspect ratio */}
          <div className="relative mb-3 aspect-square w-full">
            <ImagePre
              id={productId.toString()}
              alt={`Image of ${productName}`}
            />
          </div>

          {/* Product info */}
          <div className="space-y-1">
            <h3 className="truncate font-medium text-gray-900">
              {productName}
            </h3>
            <p className="text-sm font-semibold text-indigo-600">
              {productPrice.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
            <p className="text-sm text-gray-500">
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
