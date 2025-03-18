'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ImagePre from '@/app/components/ImagePre'

interface Produit {
  id: number
  nom: string
  prix: number
  description: string
  quantite: number
  categorieId: number | null
  images: Array<{ id: number; data: any }> 
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
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Full API Response:', data)
        
        if (!data) {
          throw new Error('No data received from API')
        }

        if (!('images' in data)) {
          console.warn('No images property in product data')
          data.images = []
        }

        console.log('Product data structure:', {
          hasId: 'id' in data,
          hasNom: 'nom' in data,
          hasPrix: 'prix' in data,
          hasImages: 'images' in data,
          imagesLength: data.images?.length
        })
        
        setProduct(data)
      } catch (error) {
        console.error('Fetch error:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    } else {
      console.error('No productId available')
      setError('No product ID provided')
      setLoading(false)
    }
  }, [productId])

  console.log('Rendering with product:', product)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Product not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
            {product.images && product.images.length > 0 ? (
                <div>
                <ImagePre 
                    id={product.id.toString()} 
                    alt={product.nom} 
                />
                <p className="text-xs text-gray-500 mt-2">
                    Product ID: {product.id}
                </p>
                </div>
            ) : (
                <div>
                <ImagePre 
                    id={product.id.toString()} 
                    alt={product.nom} 
                />
                <p className="text-xs text-gray-500 mt-2">
                    Product ID: {product.id}
                </p>
                </div>
            )}
            </div>
          
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold">{product.nom}</h1>
            <p className="text-2xl font-semibold text-gray-700">{product.prix}€</p>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-sm text-gray-500">
              Stock disponible: {product.quantite}
            </p>
            {product.categorieId && (
              <p className="text-sm text-gray-500">
                Catégorie ID: {product.categorieId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage