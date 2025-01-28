'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';

interface Product {
  id: number;
  nom: string;
  prix: number;
  categoryId: number | null; // Allows for categoryId to be null
}

interface Category {
  id: number;
  nom: string;
  produits: Product[]; // Include products in the category
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

  // Load categories with products on component mount
  useEffect(() => {
    fetchCategories();
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
      console.log('Categories with Products:', data); // Debug received categories
      setCategories(data);
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

  async function fetchResults(term: string) {
    if (!term) return; // Exit if no term is provided
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?query=${term}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data: Product[] = await response.json();
      console.log('Search Results:', data); // Debug received data
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

  function handleSearch(term: string) {
    setSearchTerm(term);
    
    // If no categories are selected, fetch results using the search API
    if (selectedCategories.length === 0) {
      fetchResults(term);
    }

    // Update URL parameters for search term
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
      return prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter((id) => id !== categoryId)
        : [...prevSelectedCategories, categoryId];
    });
    
    // If categories are selected, reset results
    if (selectedCategories.length === 0) {
      fetchResults(searchTerm); // Fetch results based on the current search term
    }
  }

  return (
    <div>
    <Header />
      {/* Search Bar */}
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>

      {/* Loading or Error Message */}
      {loading && <div>Loading...</div>}
      {error && <div role="alert">Error: {error}</div>}

      {/* Categories List */}
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

      {/* Filtered Products */}
      <div>
        {/* Show products based on selected categories */}
        {selectedCategories.length > 0 ? (
          selectedCategories.flatMap((categoryId) => 
            categories
              .find(categorie => categorie.id === categoryId)
              ?.produits.filter(product =>
                product.nom.toLowerCase().includes(searchTerm.toLowerCase())
              ) || []
          ).map((product) => (
            <ProductCard
              key={product.id}
              productName={product.nom}
              productPrice={product.prix}
              productId={product.id.toString()}
            />
          ))
        ) : (
          // If no categories are selected, show results from the search API
          results.length > 0 ? (
            results.map((product) => (
              <ProductCard
                key={product.id}
                productName={product.nom}
                productPrice={product.prix}
                productId={product.id.toString()}
              />
            ))
          ) : (
            <div>No products found.</div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}
