'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  nom: string;
  prix: number;
  categoryId: number | null; // Permet de gérer le cas où categoryId est null
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // Chargement des résultats de recherche en fonction des paramètres de l'URL
  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      fetchResults(query);
    }
  }, [searchParams]);

  // Chargement des catégories au montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchResults(term: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?query=${term}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data: Product[] = await response.json();
      console.log('Search Results:', data); // Debug des données reçues
      setResults(data);
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

  async function fetchCategories() {
    try {
      const response = await fetch(`/api/categorie`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: Category[] = await response.json();
      console.log('Categories:', data); // Debug des catégories reçues
      setCategories(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
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
    setSelectedCategories((prevSelectedCategories) => {
      const newSelectedCategories = prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter((id) => id !== categoryId)
        : [...prevSelectedCategories, categoryId];
      console.log('Selected Categories:', newSelectedCategories); // Debug des catégories sélectionnées
      return newSelectedCategories;
    });
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortOrder(event.target.value);
  }

  const filteredResults = selectedCategories.length
    ? results.filter(
        (product) =>
          product.categoryId && selectedCategories.includes(product.categoryId)
      )
    : results;

  const sortedResults = filteredResults.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.prix - b.prix;
    } else {
      return b.prix - a.prix;
    }
  });

  console.log('Filtered Results:', sortedResults); // Debug des résultats filtrés

  return (
    <div>
      {/* Barre de recherche */}
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>

      {/* Loading ou message d'erreur */}
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {/* Sorting */}
      <div className="mt-4">
        <label htmlFor="sort" className="mr-2">Sort by price:</label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Résultats filtrés */}
      <div>
        {sortedResults.length > 0 ? (
          sortedResults.map((product) => (
            <ProductCard
              key={product.id}
              productName={product.nom}
              productPrice={product.prix}
              productId={product.id.toString()}
            />
          ))
        ) : (
          <div>No products found.</div>
        )}
      </div>

      {/* Liste des catégories */}
      <div>
        <h2 className="font-bold">Catégories :</h2>
        <ul>
          {categories.map((categorie) => (
            <li key={categorie.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${categorie.id}`}
                className="mr-2"
                checked={selectedCategories.includes(categorie.id)}
                onChange={() => handleCategoryChange(categorie.id)}
              />
              <label htmlFor={`category-${categorie.id}`}>{categorie.nom}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}