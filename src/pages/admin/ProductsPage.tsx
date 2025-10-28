import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Star, Package, Upload, Image as ImageIcon, GripVertical } from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, ProductDB, Category, getProductImages, createProductImage, deleteProductImage, updateProductImage, uploadProductImage, ProductImage } from '../../lib/admin';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductDB>>({
    name: '',
    description: '',
    price: 0,
    original_price: null,
    shipping_price: 0,
    image_url: '',
    category_id: null,
    rating: 0,
    reviews: 0,
    in_stock: true,
    quantity: 0,
    featured: false,
    on_sale: false,
    tags: [],
  });
  const [priceInput, setPriceInput] = useState('');
  const [originalPriceInput, setOriginalPriceInput] = useState('');
  const [shippingPriceInput, setShippingPriceInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});
  const [productImages, setProductImages] = useState<{ [key: string]: ProductImage[] }>({});
  const [managingImagesForProduct, setManagingImagesForProduct] = useState<string | null>(null);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [draggedOverImage, setDraggedOverImage] = useState<string | null>(null);
  const [editPriceInputs, setEditPriceInputs] = useState<{ [key: string]: string }>({});
  const [editOriginalPriceInputs, setEditOriginalPriceInputs] = useState<{ [key: string]: string }>({});
  const [editShippingPriceInputs, setEditShippingPriceInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    setProducts(productsData);
    setCategories(categoriesData);

    const imagesMap: { [key: string]: ProductImage[] } = {};
    for (const product of productsData) {
      imagesMap[product.id] = await getProductImages(product.id);
    }
    setProductImages(imagesMap);

    setLoading(false);
  };

  const handleImageUpload = async (productId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(prev => ({ ...prev, [productId]: true }));
    setError(null);

    try {
      const currentImages = productImages[productId] || [];
      const nextSeq = currentImages.length > 0
        ? Math.max(...currentImages.map(img => img.seq)) + 1
        : 1;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await uploadProductImage(file);

        await createProductImage({
          product_id: productId,
          image_url: imageUrl,
          seq: nextSeq + i,
          alt_text: file.name,
        });
      }

      const updatedImages = await getProductImages(productId);
      setProductImages(prev => ({ ...prev, [productId]: updatedImages }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setUploadingImages(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleDeleteImage = async (productId: string, imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      setError(null);
      await deleteProductImage(imageId);
      const updatedImages = await getProductImages(productId);
      setProductImages(prev => ({ ...prev, [productId]: updatedImages }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  const handleUpdateImageSeq = async (productId: string, imageId: string, newSeq: number) => {
    try {
      setError(null);
      await updateProductImage(imageId, { seq: newSeq });
      const updatedImages = await getProductImages(productId);
      setProductImages(prev => ({ ...prev, [productId]: updatedImages }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image order');
    }
  };

  const handleDragStart = (imageId: string) => {
    setDraggedImage(imageId);
  };

  const handleDragOver = (e: React.DragEvent, imageId: string) => {
    e.preventDefault();
    setDraggedOverImage(imageId);
  };

  const handleDragLeave = () => {
    setDraggedOverImage(null);
  };

  const handleDrop = async (e: React.DragEvent, productId: string, targetImageId: string) => {
    e.preventDefault();
    if (!draggedImage || draggedImage === targetImageId) {
      setDraggedImage(null);
      setDraggedOverImage(null);
      return;
    }

    try {
      setError(null);
      const images = productImages[productId] || [];
      const draggedIdx = images.findIndex(img => img.id === draggedImage);
      const targetIdx = images.findIndex(img => img.id === targetImageId);

      if (draggedIdx === -1 || targetIdx === -1) return;

      const reorderedImages = [...images];
      const [removed] = reorderedImages.splice(draggedIdx, 1);
      reorderedImages.splice(targetIdx, 0, removed);

      // First, set all sequences to negative numbers to avoid unique constraint conflicts
      await Promise.all(
        reorderedImages.map((img, index) =>
          updateProductImage(img.id, { seq: -(index + 1) })
        )
      );

      // Then, set them to the correct positive sequence numbers
      await Promise.all(
        reorderedImages.map((img, index) =>
          updateProductImage(img.id, { seq: index + 1 })
        )
      );

      const updatedImages = await getProductImages(productId);
      setProductImages(prev => ({ ...prev, [productId]: updatedImages }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder images');
    } finally {
      setDraggedImage(null);
      setDraggedOverImage(null);
    }
  };

  const handleAdd = async () => {
    if (!formData.name?.trim() || !formData.price) {
      setError('Name and price are required');
      return;
    }

    try {
      setError(null);
      await createProduct(formData as Omit<ProductDB, 'id' | 'created_at' | 'updated_at'>);
      await loadData();
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const handleUpdate = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      setError(null);
      await updateProduct(id, product);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setError(null);
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const updateProductField = (id: string, field: keyof ProductDB, value: any) => {
    setProducts(products.map(prod =>
      prod.id === id ? { ...prod, [field]: value } : prod
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      original_price: null,
      shipping_price: 0,
      image_url: '',
      category_id: null,
      rating: 0,
      reviews: 0,
      in_stock: true,
      quantity: 0,
      featured: false,
      on_sale: false,
      tags: [],
    });
    setPriceInput('');
    setOriginalPriceInput('');
    setShippingPriceInput('');
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'No category';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-parchment-300">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-parchment-50 font-display">Products</h1>
          <p className="text-parchment-300 mt-2">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-forge-900 border border-forge-700 rounded-lg text-forge-300">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 p-6 bg-walnut-900 border border-walnut-700 rounded-lg">
          <h3 className="text-xl font-bold text-parchment-50 mb-4">Add New Product</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">Category</label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value || null })}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
              >
                <option value="">No category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">Price *</label>
              <input
                type="text"
                inputMode="decimal"
                value={priceInput}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setPriceInput(value);
                    setFormData({ ...formData, price: value === '' ? 0 : parseFloat(value) || 0 });
                  }
                }}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">Original Price</label>
              <input
                type="text"
                inputMode="decimal"
                value={originalPriceInput}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setOriginalPriceInput(value);
                    setFormData({ ...formData, original_price: value === '' ? null : parseFloat(value) || null });
                  }
                }}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">Shipping Price *</label>
              <input
                type="text"
                inputMode="decimal"
                value={shippingPriceInput}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setShippingPriceInput(value);
                    setFormData({ ...formData, shipping_price: value === '' ? 0 : parseFloat(value) || 0 });
                  }
                }}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">Quantity in Stock *</label>
              <input
                type="number"
                min="0"
                value={formData.quantity || 0}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-parchment-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                rows={3}
              />
            </div>
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2 text-parchment-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="rounded border-walnut-700 bg-walnut-800 text-forge-600 focus:ring-forge-500"
                />
                In Stock
              </label>
              <label className="flex items-center gap-2 text-parchment-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-walnut-700 bg-walnut-800 text-forge-600 focus:ring-forge-500"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-parchment-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.on_sale}
                  onChange={(e) => setFormData({ ...formData, on_sale: e.target.checked })}
                  className="rounded border-walnut-700 bg-walnut-800 text-forge-600 focus:ring-forge-500"
                />
                On Sale
              </label>
            </div>
            <div className="col-span-2 flex gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Product
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
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

      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="p-12 bg-walnut-900 border border-walnut-800 rounded-lg text-center">
            <Package className="h-12 w-12 text-parchment-400 mx-auto mb-4" />
            <p className="text-parchment-400">No products yet. Create your first product to get started.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-6 bg-walnut-900 border border-walnut-800 rounded-lg hover:border-walnut-700 transition-colors">
              <div className="flex gap-6">
                <div className="w-32 h-32 bg-walnut-800 rounded-lg overflow-hidden flex-shrink-0">
                  {productImages[product.id]?.[0]?.image_url ? (
                    <img src={productImages[product.id][0].image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-parchment-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {editingId === product.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProductField(product.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                        placeholder="Product name"
                      />
                      <textarea
                        value={product.description}
                        onChange={(e) => updateProductField(product.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                        rows={2}
                        placeholder="Description"
                      />
                      <div className="grid grid-cols-5 gap-3">
                        <div>
                          <label className="block text-xs text-parchment-400 mb-1">Price</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editPriceInputs[product.id] ?? product.price}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setEditPriceInputs(prev => ({ ...prev, [product.id]: value }));
                                updateProductField(product.id, 'price', value === '' ? 0 : parseFloat(value) || 0);
                              }
                            }}
                            className="w-full px-3 py-2 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-parchment-400 mb-1">Original</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editOriginalPriceInputs[product.id] ?? (product.original_price || '')}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setEditOriginalPriceInputs(prev => ({ ...prev, [product.id]: value }));
                                updateProductField(product.id, 'original_price', value === '' ? null : parseFloat(value) || null);
                              }
                            }}
                            className="w-full px-3 py-2 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-parchment-400 mb-1">Shipping</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editShippingPriceInputs[product.id] ?? (product.shipping_price || 0)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setEditShippingPriceInputs(prev => ({ ...prev, [product.id]: value }));
                                updateProductField(product.id, 'shipping_price', value === '' ? 0 : parseFloat(value) || 0);
                              }
                            }}
                            className="w-full px-3 py-2 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-parchment-400 mb-1">Quantity</label>
                          <input
                            type="number"
                            min="0"
                            value={product.quantity}
                            onChange={(e) => updateProductField(product.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-parchment-400 mb-1">Category</label>
                          <select
                            value={product.category_id || ''}
                            onChange={(e) => updateProductField(product.id, 'category_id', e.target.value || null)}
                            className="w-full px-3 py-2 bg-walnut-800 border border-walnut-700 rounded text-parchment-100 focus:outline-none focus:ring-2 focus:ring-forge-500"
                          >
                            <option value="">None</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-parchment-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.in_stock}
                            onChange={(e) => updateProductField(product.id, 'in_stock', e.target.checked)}
                            className="rounded border-walnut-700 bg-walnut-800 text-forge-600 focus:ring-forge-500"
                          />
                          In Stock
                        </label>
                        <label className="flex items-center gap-2 text-parchment-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.featured}
                            onChange={(e) => updateProductField(product.id, 'featured', e.target.checked)}
                            className="rounded border-walnut-700 bg-walnut-800 text-forge-600 focus:ring-forge-500"
                          />
                          Featured
                        </label>
                        <label className="flex items-center gap-2 text-parchment-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.on_sale}
                            onChange={(e) => updateProductField(product.id, 'on_sale', e.target.checked)}
                            className="rounded border-walnut-700 bg-walnut-800 text-forge-600 focus:ring-forge-500"
                          />
                          On Sale
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-parchment-50">{product.name}</h3>
                          <p className="text-sm text-parchment-400 mt-1">{getCategoryName(product.category_id)}</p>
                        </div>
                        <div className="flex gap-2">
                          {product.featured && (
                            <span className="px-2 py-1 bg-gold-900 text-gold-300 text-xs rounded flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Featured
                            </span>
                          )}
                          {product.on_sale && (
                            <span className="px-2 py-1 bg-forge-900 text-forge-300 text-xs rounded">
                              On Sale
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded ${product.in_stock ? 'bg-patina-900 text-patina-300' : 'bg-walnut-800 text-parchment-400'}`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      <p className="text-parchment-300 text-sm mb-3">{product.description || 'No description'}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-parchment-100 font-bold">${product.price.toFixed(2)}</div>
                        {product.original_price && (
                          <div className="text-parchment-400 line-through">${product.original_price.toFixed(2)}</div>
                        )}
                        <div className="text-parchment-300">+ ${product.shipping_price?.toFixed(2) || '0.00'} shipping</div>
                        <div className="flex items-center gap-1 text-parchment-300">
                          <Package className="h-4 w-4" />
                          <span>{product.quantity} in stock</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {editingId === product.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(product.id)}
                        className="p-2 text-patina-400 hover:bg-walnut-800 rounded transition-colors"
                        title="Save"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditPriceInputs(prev => {
                            const newState = { ...prev };
                            delete newState[product.id];
                            return newState;
                          });
                          setEditOriginalPriceInputs(prev => {
                            const newState = { ...prev };
                            delete newState[product.id];
                            return newState;
                          });
                          setEditShippingPriceInputs(prev => {
                            const newState = { ...prev };
                            delete newState[product.id];
                            return newState;
                          });
                          loadData();
                        }}
                        className="p-2 text-parchment-400 hover:bg-walnut-800 rounded transition-colors"
                        title="Cancel"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setManagingImagesForProduct(managingImagesForProduct === product.id ? null : product.id)}
                        className="p-2 text-ember-400 hover:bg-walnut-800 rounded transition-colors"
                        title="Manage Images"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(product.id);
                          setEditPriceInputs(prev => ({ ...prev, [product.id]: String(product.price) }));
                          setEditOriginalPriceInputs(prev => ({ ...prev, [product.id]: product.original_price ? String(product.original_price) : '' }));
                          setEditShippingPriceInputs(prev => ({ ...prev, [product.id]: String(product.shipping_price || 0) }));
                        }}
                        className="p-2 text-parchment-300 hover:bg-walnut-800 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-forge-400 hover:bg-walnut-800 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {managingImagesForProduct === product.id && (
                <div className="mt-6 pt-6 border-t border-walnut-700">
                  <h4 className="text-lg font-bold text-parchment-50 mb-4">Product Images</h4>

                  <div className="mb-4">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-walnut-800 border-2 border-dashed border-walnut-600 rounded-lg cursor-pointer hover:border-forge-500 hover:bg-walnut-750 transition-colors">
                      <Upload className="h-5 w-5 text-parchment-400" />
                      <span className="text-parchment-300">
                        {uploadingImages[product.id] ? 'Uploading...' : 'Upload Images'}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(product.id, e.target.files)}
                        className="hidden"
                        disabled={uploadingImages[product.id]}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {productImages[product.id]?.map((image) => (
                      <div
                        key={image.id}
                        draggable
                        onDragStart={() => handleDragStart(image.id)}
                        onDragOver={(e) => handleDragOver(e, image.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, product.id, image.id)}
                        className={`relative group bg-walnut-800 rounded-lg overflow-hidden cursor-move transition-all ${
                          draggedImage === image.id ? 'opacity-50 scale-95' : ''
                        } ${
                          draggedOverImage === image.id ? 'ring-2 ring-forge-500 scale-105' : ''
                        }`}
                      >
                        <img src={image.image_url} alt={image.alt_text} className="w-full h-32 object-cover" />
                        <div className="absolute top-2 left-2 p-1 bg-soot-950/80 rounded cursor-move">
                          <GripVertical className="h-4 w-4 text-parchment-300" />
                        </div>
                        <div className="absolute inset-0 bg-soot-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteImage(product.id, image.id)}
                            className="p-2 bg-forge-600 text-parchment-50 rounded hover:bg-forge-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-soot-950 to-transparent p-2">
                          <span className="text-xs text-parchment-300">Order: {image.seq}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(!productImages[product.id] || productImages[product.id].length === 0) && (
                    <div className="text-center py-8 text-parchment-400">
                      No images uploaded yet. Upload images to display them in the product gallery.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
