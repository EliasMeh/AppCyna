'use client'
import React, { useState, useEffect } from 'react'

const GrilleModifiable = () => {
  interface Produit {
    id: number
    nom: string
    prix: number
    description: string
    quantite: number
    categorieId: number
  }

  const [products, setProducts] = useState<Produit[]>([])

  useEffect(() => {
    fetch('/api/produits')
      .then(response => response.json())
      .then(data => {
        setProducts(data)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  const handleInputChange = (id: number, field: string, value: string | number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const handleSubmit = async (product: Produit) => {
    try {
      const response = await fetch(`/api/produits/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      if (response.ok) {
        console.log('Product updated successfully')
      } else {
        console.error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">Nom</th>
            <th className="py-2">Prix</th>
            <th className="py-2">Description</th>
            <th className="py-2">Quantité</th>
            <th className="py-2">Categorie ID</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
          products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">
                <input 
                  type="text" 
                  value={product.nom || ''} 
                  onChange={(e) => handleInputChange(product.id, 'nom', e.target.value)} 
                />
              </td>
              <td className="border px-4 py-2">
                <input 
                  type="number" 
                  value={product.prix || ''} 
                  onChange={(e) => handleInputChange(product.id, 'prix', parseFloat(e.target.value))} 
                />
              </td>
              <td className="border px-4 py-2">
                <input 
                  type="text" 
                  value={product.description || ''} 
                  onChange={(e) => handleInputChange(product.id, 'description', e.target.value)} 
                />
              </td>
              <td className="border px-4 py-2">
                <input 
                  type="number" 
                  value={product.quantite || ''} 
                  onChange={(e) => handleInputChange(product.id, 'quantite', parseInt(e.target.value))} 
                />
              </td>
              <td className="border px-4 py-2">
                <input 
                  type="number" 
                  value={product.categorieId || ''} 
                  onChange={(e) => handleInputChange(product.id, 'categorieId', parseInt(e.target.value))} 
                />
              </td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => handleSubmit(product)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GrilleModifiable