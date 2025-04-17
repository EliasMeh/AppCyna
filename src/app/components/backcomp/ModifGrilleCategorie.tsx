'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Category {
  id: number;
  nom: string;
}

interface GrilleCategorie {
  id: number;
  categorie1: Category | null;
  categorie2: Category | null;
  categorie3: Category | null;
}

const ModifGrilleCategorie = () => {
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [activeGrille, setActiveGrille] = useState<GrilleCategorie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/categorie').then(res => res.json()),
      fetch('/api/categorie/grillecategorie').then(res => res.json())
    ]).then(([categories, grille]) => {
      setAvailableCategories(categories);
      setActiveGrille(grille);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      setLoading(false);
    });
  }, []);

  const handleAddCategory = async (categoryId: number, position: 1 | 2 | 3) => {
    try {
      const updateData = {
        id: activeGrille?.id,
        [`categorie${position}Id`]: categoryId
      };

      const response = await fetch('/api/categorie/grillecategorie', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update grille');
      
      const updatedGrille = await response.json();
      setActiveGrille(updatedGrille);
    } catch (error) {
      console.error('Error updating grille:', error);
      setError('Failed to update grille');
    }
  };

  const handleRemoveCategory = async (position: 1 | 2 | 3) => {
    try {
      const updateData = {
        id: activeGrille?.id,
        [`categorie${position}Id`]: null
      };

      const response = await fetch('/api/categorie/grillecategorie', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update grille');
      
      const updatedGrille = await response.json();
      setActiveGrille(updatedGrille);
    } catch (error) {
      console.error('Error updating grille:', error);
      setError('Failed to remove category');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-6 text-2xl font-bold">Gérer les Catégories de la Grille</h2>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Category Position 1 */}
        <div className="rounded-lg border p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold">Position 1</h3>
          {activeGrille?.categorie1 ? (
            <div className="mb-4">
              <p className="mb-2 font-medium">{activeGrille.categorie1.nom}</p>
              <Button 
                onClick={() => handleRemoveCategory(1)}
                variant="destructive"
                className="w-full"
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {availableCategories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => handleAddCategory(category.id, 1)}
                  className="mb-2 w-full bg-customViolet"
                >
                  {category.nom}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Category Position 2 */}
        <div className="rounded-lg border p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold">Position 2</h3>
          {activeGrille?.categorie2 ? (
            <div className="mb-4">
              <p className="mb-2 font-medium">{activeGrille.categorie2.nom}</p>
              <Button 
                onClick={() => handleRemoveCategory(2)}
                variant="destructive"
                className="w-full"
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {availableCategories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => handleAddCategory(category.id, 2)}
                  className="mb-2 w-full bg-customViolet"
                >
                  {category.nom}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Category Position 3 */}
        <div className="rounded-lg border p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold">Position 3</h3>
          {activeGrille?.categorie3 ? (
            <div className="mb-4">
              <p className="mb-2 font-medium">{activeGrille.categorie3.nom}</p>
              <Button 
                onClick={() => handleRemoveCategory(3)}
                variant="destructive"
                className="w-full"
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {availableCategories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => handleAddCategory(category.id, 3)}
                  className="mb-2 w-full bg-customViolet"
                >
                  {category.nom}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModifGrilleCategorie;