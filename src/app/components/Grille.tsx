'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
}

const Grille = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/produits');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-4 mt-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          productId={product.id}
          productName={product.nom}
          productPrice={product.prix}
          stock={product.quantite}
        />
      ))}
    </div>
  );
};

export default Grille;
