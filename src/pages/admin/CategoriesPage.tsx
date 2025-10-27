import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from '../../lib/admin';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setError(null);
      await createCategory(formData);
      await loadCategories();
      setFormData({ name: '', description: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  };

  const handleUpdate = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    try {
      setError(null);
      await updateCategory(id, {
        name: category.name,
        description: category.description
      });
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setError(null);
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const updateCategoryField = (id: string, field: keyof Category, value: string) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-parchment-300">Loading categories...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-parchment-50 font-display">Categories</h1>
          <p className="text-parchment-300 mt-2">Manage product categories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-forge-900 border border-forge-700 rounded-lg text-forge-300">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 p-6 bg-walnut-900 border border-walnut-700 rounded-lg">
          <h3 className="text-xl font-bold text-parchment-50 mb-4">Add New Category</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                rows={3}
                placeholder="Category description"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', description: '' });
                  setError(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-walnut-800 text-parchment-300 rounded-lg hover:bg-walnut-700 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-walnut-900 border border-walnut-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-walnut-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-parchment-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-parchment-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-parchment-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-walnut-800">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-parchment-400">
                  No categories yet. Create your first category to get started.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-walnut-800 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategoryField(category.id, 'name', e.target.value)}
                        className="w-full px-3 py-1 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                      />
                    ) : (
                      <span className="text-parchment-100 font-medium">{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={category.description}
                        onChange={(e) => updateCategoryField(category.id, 'description', e.target.value)}
                        className="w-full px-3 py-1 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                      />
                    ) : (
                      <span className="text-parchment-400 text-sm">{category.description || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(category.id)}
                            className="p-2 text-patina-400 hover:bg-walnut-700 rounded transition-colors"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              loadCategories();
                            }}
                            className="p-2 text-parchment-400 hover:bg-walnut-700 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(category.id)}
                            className="p-2 text-parchment-300 hover:bg-walnut-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-forge-400 hover:bg-walnut-700 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
