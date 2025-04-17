'use client';
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const GrilleModifiable = () => {
  interface Produit {
    id: number;
    nom: string;
    prix: number;
    description: string;
    quantite: number;
    categorieId: number;
  }

  const [products, setProducts] = useState<Produit[]>([]);
  const [sortField, setSortField] = useState<keyof Produit | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetch('/api/produits')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const handleSubmit = async (product: Produit) => {
    try {
      const response = await fetch(`/api/produits/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        console.log('Product updated successfully');
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleSort = (field: keyof Produit) => {
    const direction =
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sortedProducts = [...products].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setProducts(sortedProducts);
  };

  const SortHeader = ({
    field,
    label,
  }: {
    field: keyof Produit;
    label: string;
  }) => (
    <th
      className="cursor-pointer px-4 py-2 hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-between">
        {label}
        <div className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 ${
              sortField === field && sortDirection === 'asc'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 ${
              sortField === field && sortDirection === 'desc'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <SortHeader field="id" label="ID" />
            <SortHeader field="nom" label="Nom" />
            <SortHeader field="prix" label="Prix" />
            <SortHeader field="description" label="Description" />
            <SortHeader field="quantite" label="Quantité" />
            <SortHeader field="categorieId" label="Categorie ID" />
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={product.nom || ''}
                  onChange={(e) =>
                    handleInputChange(product.id, 'nom', e.target.value)
                  }
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={product.prix || ''}
                  onChange={(e) =>
                    handleInputChange(
                      product.id,
                      'prix',
                      parseFloat(e.target.value)
                    )
                  }
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={product.description || ''}
                  onChange={(e) =>
                    handleInputChange(product.id, 'description', e.target.value)
                  }
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={product.quantite || ''}
                  onChange={(e) =>
                    handleInputChange(
                      product.id,
                      'quantite',
                      parseInt(e.target.value)
                    )
                  }
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={product.categorieId || ''}
                  onChange={(e) =>
                    handleInputChange(
                      product.id,
                      'categorieId',
                      parseInt(e.target.value)
                    )
                  }
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleSubmit(product)}
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrilleModifiable;
