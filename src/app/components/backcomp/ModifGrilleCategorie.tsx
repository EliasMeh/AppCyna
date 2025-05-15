'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

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

interface Product {
  id: number;
  nom: string;
  prix: number;
  description: string;
  quantite: number;
  categorieId: number;
  placement: number;
}

interface CategoryWithProducts extends Category {
  produits: Product[];
}

const ModifGrilleCategorie = () => {
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [activeGrille, setActiveGrille] = useState<GrilleCategorie | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [emptyCategories, setEmptyCategories] = useState<
    CategoryWithProducts[]
  >([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categorie').then((res) => res.json()),
      fetch('/api/categorie/grillecategorie').then((res) => res.json()),
    ])
      .then(([categories, grille]) => {
        setAvailableCategories(categories);
        setActiveGrille(grille);

        // Filter categories without products
        const emptyCats = categories.filter(
          (cat: CategoryWithProducts) => !cat.produits?.length
        );
        setEmptyCategories(emptyCats);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading data:', err);
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  const handleAddCategory = async (categoryId: number, position: 1 | 2 | 3) => {
    try {
      const updateData = {
        id: activeGrille?.id,
        [`categorie${position}Id`]: categoryId,
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
        [`categorie${position}Id`]: null,
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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categorie');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load categories'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id: number, newName: string) => {
    try {
      const response = await fetch(`/api/categorie/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom: newName }),
      });

      if (!response.ok) throw new Error('Failed to update category');

      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, nom: newName } : cat
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update category'
      );
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('/api/categorie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom: newCategory }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      const createdCategory = await response.json();

      // Update both category lists
      setCategories([...categories, createdCategory]);
      setAvailableCategories([...availableCategories, createdCategory]);

      // Reset the input
      setNewCategory('');

      // Optionally refresh all data to ensure consistency
      Promise.all([
        fetch('/api/categorie').then((res) => res.json()),
        fetch('/api/categorie/grillecategorie').then((res) => res.json()),
      ])
        .then(([categories, grille]) => {
          setAvailableCategories(categories);
          setActiveGrille(grille);
        })
        .catch((err) => {
          console.error('Error refreshing data:', err);
        });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create category'
      );
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categorie/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      // Update all relevant states
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setAvailableCategories((prev) => prev.filter((cat) => cat.id !== id));
      setEmptyCategories((prev) => prev.filter((cat) => cat.id !== id));

      // If the category was in the grille, refresh the grille data
      if (
        activeGrille?.categorie1?.id === id ||
        activeGrille?.categorie2?.id === id ||
        activeGrille?.categorie3?.id === id
      ) {
        const grilleResponse = await fetch('/api/categorie/grillecategorie');
        if (!grilleResponse.ok) {
          throw new Error('Failed to refresh grille data');
        }
        const updatedGrille = await grilleResponse.json();
        setActiveGrille(updatedGrille);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to delete category'
      );
    }
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    const sortedCategories = [...categories].sort((a, b) => {
      return newDirection === 'asc'
        ? a.nom.localeCompare(b.nom)
        : b.nom.localeCompare(a.nom);
    });
    setCategories(sortedCategories);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-6 text-2xl font-bold">
        Gérer les Catégories de la Grille
      </h2>

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
              {availableCategories.map((category) => (
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
              {availableCategories.map((category) => (
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
              {availableCategories.map((category) => (
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

      {/* Empty Categories Section */}
      {emptyCategories.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">
            Categories Without Products
          </h3>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="grid gap-2">
              {emptyCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
                >
                  <span>{category.nom}</span>
                  <Button
                    onClick={() => handleDeleteCategory(category.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete Empty Category
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th
                className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                onClick={handleSort}
              >
                <div className="flex items-center justify-between">
                  Name
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`h-3 w-3 ${
                        sortDirection === 'asc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <ChevronDown
                      className={`h-3 w-3 ${
                        sortDirection === 'desc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="px-4 py-2">{category.id}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={category.nom}
                    onChange={(e) => {
                      setCategories(
                        categories.map((cat) =>
                          cat.id === category.id
                            ? { ...cat, nom: e.target.value }
                            : cat
                        )
                      );
                    }}
                    onBlur={(e) =>
                      handleUpdateCategory(category.id, e.target.value)
                    }
                    className="w-full rounded border p-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="px-4 py-2">New</td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="w-full rounded border p-1"
                />
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={handleCreateCategory}
                  className="rounded bg-green-500 px-4 py-1 text-white hover:bg-green-600"
                >
                  Create
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModifGrilleCategorie;
