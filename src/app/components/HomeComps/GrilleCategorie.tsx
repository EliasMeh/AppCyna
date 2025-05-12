'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  nom: string;
}

interface GrilleCategorieData {
  categorie1: Category | null;
  categorie2: Category | null;
  categorie3: Category | null;
}

const GrilleCategorie = () => {
  const [categories, setCategories] = useState<GrilleCategorieData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categorie/grillecategorie');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  const handleCategoryClick = (categoryId: number) => {
    // Create a URLSearchParams object to pass the selected category
    const searchParams = new URLSearchParams();
    searchParams.set('selectedCategory', categoryId.toString());
    
    // Navigate to the search page with the category pre-selected
    router.push(`/pages/recherche?${searchParams.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 w-full max-w-4xl mx-auto">
      {categories?.categorie1 && (
        <Button
          onClick={() => handleCategoryClick(categories.categorie1!.id)}
          className="w-full bg-customViolet px-4 py-2 text-sm sm:text-base hover:bg-customViolet/90"
        >
          {categories.categorie1.nom}
        </Button>
      )}
      
      {categories?.categorie2 && (
        <Button
          onClick={() => handleCategoryClick(categories.categorie2!.id)}
          className="w-full bg-customViolet px-4 py-2 text-sm sm:text-base hover:bg-customViolet/90"
        >
          {categories.categorie2.nom}
        </Button>
      )}
      
      {categories?.categorie3 && (
        <Button
          onClick={() => handleCategoryClick(categories.categorie3!.id)}
          className="w-full bg-customViolet px-4 py-2 text-sm sm:text-base hover:bg-customViolet/90"
        >
          {categories.categorie3.nom}
        </Button>
      )}

      {!categories?.categorie1 && !categories?.categorie2 && !categories?.categorie3 && (
        <div className="col-span-full text-center text-gray-500">
          Aucune catégorie disponible
        </div>
      )}
    </div>
  );
};

export default GrilleCategorie;