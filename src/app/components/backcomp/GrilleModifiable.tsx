'use client';
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description: string;
  quantite: number;
  categorieId: number;
  placement: number;
}

interface Categorie {
  id: number;
  nom: string;
}

const GrilleModifiable = () => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sortField, setSortField] = useState<keyof Produit | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Fetch products
    fetch('/api/produits')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));

    // Fetch categories
    fetch('/api/categorie')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
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
      if (field === 'categorieId') {
        // Sort by category name instead of ID
        const catA = categories.find(cat => cat.id === a[field])?.nom || '';
        const catB = categories.find(cat => cat.id === b[field])?.nom || '';
        return direction === 'asc' 
          ? catA.localeCompare(catB)
          : catB.localeCompare(catA);
      }
      // Original sorting for other fields
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <SortHeader field="id" label="ID" />
            <SortHeader field="nom" label="Nom" />
            <SortHeader field="prix" label="Prix" />
            <SortHeader field="description" label="Description" />
            <SortHeader field="quantite" label="Quantité" />
            <SortHeader field="categorieId" label="Catégorie" />
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
                  className="w-full p-1 border rounded"
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
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={product.description || ''}
                  onChange={(e) =>
                    handleInputChange(product.id, 'description', e.target.value)
                  }
                  className="w-full p-1 border rounded"
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
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border px-4 py-2">
                <Select
                  value={product.categorieId?.toString()}
                  onValueChange={(value) =>
                    handleInputChange(product.id, 'categorieId', parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category">
                      {categories.find(cat => cat.id === product.categorieId)?.nom || 'Select category'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
