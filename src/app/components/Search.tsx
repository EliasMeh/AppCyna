'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  nom: string;
  prix: number;
  categoryId: number | null;
  description: string;
  quantite: number;
  stock?: number;
}

interface Category {
  id: number;
  nom: string;
  produits: Product[];
}

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showInStock, setShowInStock] = useState(false);

  useEffect(() => {
    fetchCategories();

    const params = new URLSearchParams(window.location.search);
    const preSelectedCategory = params.get('selectedCategory');

    if (preSelectedCategory) {
      const categoryId = parseInt(preSelectedCategory);
      setSelectedCategories([categoryId]);
    }
  }, []);

  async function fetchCategories() {  
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/categorie`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchResults(term: string) {
    if (!term) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(term)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data: Product[] = await response.json();
      setResults(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(term: string) {
    setSearchTerm(term);
    if (selectedCategories.length === 0) {
      fetchResults(term);
    }
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleCategoryChange(categoryId: number) {
    setSelectedCategories((prevSelectedCategories) => {
      const newSelected = prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter((id) => id !== categoryId)
        : [...prevSelectedCategories, categoryId];
      return newSelected;
    });

    if (selectedCategories.length === 0) {
      fetchResults(searchTerm);
    }
  }

  const filteredProducts =
    selectedCategories.length > 0
      ? selectedCategories.flatMap(
          (categoryId) =>
            categories
              .find((categorie) => categorie.id === categoryId)
              ?.produits.filter(
                (product) =>
                  product.nom
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                  (!showInStock || product.quantite > 0)
              ) || []
        )
      : results.filter((product) => !showInStock || product.quantite > 0);

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-4 pl-12 focus:border-blue-500 focus:outline-none"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar with Categories and Filters */}
        <div className="md:col-span-1">
          <div className="sticky top-4 rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-bold">Categories</h2>
            {loading ? (
              <div>Loading categories...</div>
            ) : (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      className="mr-2 rounded"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="cursor-pointer text-sm"
                    >
                      {category.nom}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {/* Availability Filter */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="mb-4 text-lg font-bold">Availability</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="in-stock"
                  className="mr-2 rounded"
                  checked={showInStock}
                  onChange={(e) => setShowInStock(e.target.checked)}
                />
                <label htmlFor="in-stock" className="cursor-pointer text-sm">
                  In Stock Only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : loading ? (
            <div>Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    productName={product.nom}
                    productPrice={product.prix}
                    stock={product.quantite}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No products found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
