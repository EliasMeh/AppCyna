'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ImagePre from '@/app/components/ImagePre'

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
}

const ProductPage = () => {
  const params = useParams()
  const productId = params.id
  const [product, setProduct] = useState<Produit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      console.log('Fetching product with ID:', productId)
      try {
        const response = await fetch(`/api/produits/${productId}`)
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product (HTTP ${response.status})`)
        }
        
        const data: Produit = await response.json()
        console.log('Product data received:', {
          id: data.id,
          name: data.nom,
          imagesCount: data.images?.length ?? 0
        })
        
        if (!data) {
          throw new Error('No data received from API')
        }

        // Ensure images array exists
        if (!Array.isArray(data.images)) {
          console.warn('Images property is not an array, initializing empty array')
          data.images = []
        }

        // Validate required fields
        if (!data.id || !data.nom || typeof data.prix !== 'number') {
          throw new Error('Invalid product data received')
        }

        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError(error instanceof Error ? error.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (!productId) {
      console.error('No product ID provided')
      setError('Missing product ID')
      setLoading(false)
      return
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">
          <p className="text-xl text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error loading product</p>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image Section */}
          <div className="md:w-1/2 p-6">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
              <ImagePre 
                id={product.id.toString()} 
                alt={product.nom}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              ID: {product.id}
            </p>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-6 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.nom}</h1>
            <p className="text-2xl font-semibold text-indigo-600">
              {product.prix.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm flex items-center gap-2">
                <span className="font-medium text-gray-700">Stock:</span>
                <span className={`${
                  product.quantite > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.quantite > 0 ? `${product.quantite} available` : 'Out of stock'}
                </span>
              </p>
              {product.categorieId && (
                <p className="text-sm flex items-center gap-2">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="text-gray-600">{product.categorieId}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage