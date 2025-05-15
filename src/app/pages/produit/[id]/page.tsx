'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ImagePre from '@/app/components/ImagePre';
import AddToCart from '@/app/components/AddToCart';
import Header from '@/app/communs/Header';
import ProductCard from '@/app/components/ProductCard';

interface ProductImage {
  id: number;
  data: {
    type: 'Buffer';
    data: number[];
  };
}

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description: string;
  quantite: number;
  categorieId: number | null;
  images: ProductImage[];
  categorie?: {
    id: number;
    nom: string;
  };
}

interface SimilarProduct {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
}

const ProductPage = () => {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log('Fetching product with ID:', productId);
      try {
        const [productResponse, similarResponse] = await Promise.all([
          fetch(`/api/produits/${productId}`),
          fetch(`/api/similarproduit/${productId}`)
        ]);

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch product (HTTP ${productResponse.status})`);
        }

        const data: Produit = await productResponse.json();
        console.log('Product data received:', {
          id: data.id,
          name: data.nom,
          imagesCount: data.images?.length ?? 0,
        });

        if (!data) {
          throw new Error('No data received from API');
        }

        // Ensure images array exists
        if (!Array.isArray(data.images)) {
          console.warn(
            'Images property is not an array, initializing empty array'
          );
          data.images = [];
        }

        // Validate required fields
        if (!data.id || !data.nom || typeof data.prix !== 'number') {
          throw new Error('Invalid product data received');
        }

        setProduct(data);

        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarProducts(similarData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load product'
        );
      } finally {
        setLoading(false);
      }
    };

    if (!productId) {
      console.error('No product ID provided');
      setError('Missing product ID');
      setLoading(false);
      return;
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse">
            <p className="text-xl text-gray-600">Loading product details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p className="mb-4 text-xl text-red-500">Error loading product</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-xl text-gray-600">Product not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="flex flex-col md:flex-row">
            {/* Product Image Section */}
            <div className="p-6 md:w-1/2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <ImagePre id={product.id.toString()} alt={product.nom} />
              </div>
              <p className="mt-2 text-center text-xs text-gray-500">
                ID: {product.id}
              </p>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4 p-6 md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900">{product.nom}</h1>
              <p className="text-2xl font-semibold text-indigo-600">
                {product.prix.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
              <div className="prose prose-sm text-gray-600">
                <p>{product.description}</p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Stock:</span>
                  <span
                    className={`${
                      product.quantite > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.quantite > 0
                      ? `${product.quantite} available`
                      : 'Out of stock'}
                  </span>
                </p>
                {product.categorie && (
                  <p className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="text-gray-600">{product.categorie.nom}</span>
                  </p>
                )}

                {/* Add to Cart Button */}
                <div className="mt-6">
                  <AddToCart
                    productId={product.id}
                    productName={product.nom}
                    productPrice={product.prix}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Product Section */}
        {similarProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Similar Product</h2>
            <div className="flex justify-center">
              <div className="w-72"> {/* Add this container with fixed width */}
                <ProductCard
                  key={similarProducts[0].id}
                  productId={similarProducts[0].id}
                  productName={similarProducts[0].nom}
                  productPrice={similarProducts[0].prix}
                  stock={similarProducts[0].quantite}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPage;
