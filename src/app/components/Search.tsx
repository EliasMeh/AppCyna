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
}

interface Category {
  id: number;
  nom: string;
}

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      fetchResults(query);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchResults(term: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data: Product[] = await response.json();
      console.log('Search Results:', data);
      setResults(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categorie');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: Category[] = await response.json();
      console.log('Categories:', data);
      setCategories(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleCategoryChange(categoryId: number) {
    setSelectedCategories(prev => {
      const newSelected = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      console.log('Selected Categories:', newSelected);
      return newSelected;
    });
  }

  const filteredResults = results.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || 
      (product.categoryId && selectedCategories.includes(product.categoryId));
    const matchesAvailability = !showAvailableOnly || product.quantite > 0;
    return matchesCategory && matchesAvailability;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="relative flex flex-1 flex-shrink-0 mb-6">
        <label htmlFor="search" className="sr-only">
          Search products
        </label>
        <input
          id="search"
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search for products..."
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search products"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-4 bg-white p-4 rounded-lg shadow space-y-6">
            {/* Availability Filter */}
            <div>
              <h2 className="font-bold text-lg mb-4">Disponibilité</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available-only"
                  className="mr-2 rounded"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                />
                <label 
                  htmlFor="available-only"
                  className="text-sm cursor-pointer hover:text-gray-700"
                >
                  Produits en stock uniquement
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="font-bold text-lg mb-4">Categories</h2>
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
                      className="text-sm cursor-pointer hover:text-gray-700"
                    >
                      {category.nom}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {filteredResults.length} produit{filteredResults.length !== 1 ? 's' : ''} trouvé{filteredResults.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.length > 0 ? (
                  filteredResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      productId={product.id}
                      productName={product.nom}
                      productPrice={product.prix}
                      description={product.description}
                      stock={product.quantite}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    Aucun produit trouvé.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}