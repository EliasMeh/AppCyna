import React from 'react';
import Link from 'next/link';
import AddToCart from './AddToCart';
import ImagePre from './ImagePre';

interface ProductCardProps {
  productId: number;
  productName: string;
  productPrice: number;
  description?: string;
  stock: number;
}

const ProductCard = ({
  productName,
  productPrice,
  productId,
  description,
  stock,
}: ProductCardProps) => {
  return (
    <div className="w-full rounded-md border border-gray-300 p-3 transition-shadow hover:shadow-md bg-white">
      <Link href={`/pages/produit/${productId}`}>
        <div className="cursor-pointer">
          <ImagePre id={productId.toString()} alt={`Image of ${productName}`} />
          <div className="mt-2 space-y-1">
            <h3 className="text-sm font-semibold">{productName}</h3>
            <p className="text-base font-bold">{productPrice}€</p>
            {description && (
              <p className="line-clamp-2 text-xs text-gray-600">
                {description}
              </p>
            )}
            <p
              className={`text-xs ${
                stock > 0 ? 'text-green-600' : 'text-red-600'
              } font-medium`}
            >
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-3">
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
