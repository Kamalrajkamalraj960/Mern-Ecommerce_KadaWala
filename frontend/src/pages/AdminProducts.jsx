import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiX, FiUpload, FiImage } from 'react-icons/fi';

const AdminProducts = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means "Add", object means "Edit"
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '0',
    stock: '10',
    description: '',
    sizes: 'Standard',
    colors: 'Natural',
    featured: false,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch product list
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products?search=${encodeURIComponent(searchQuery)}`);
      setProducts(data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch products catalog', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle local image file selections
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create file reader previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      brand: '',
      category: 'Home Decor',
      price: '',
      discountPrice: '0',
      stock: '10',
      description: '',
      sizes: 'Standard',
      colors: 'Natural',
      featured: false,
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      discountPrice: product.discountPrice ? product.discountPrice.toString() : '0',
      stock: product.stock.toString(),
      description: product.description,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      featured: product.featured,
    });
    setSelectedFiles([]);
    setImagePreviews(product.images || []); // Show existing image URLs as previews
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.title || !formData.brand || !formData.category || !formData.price || !formData.description) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // Use FormData to support file uploads
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title);
      dataPayload.append('brand', formData.brand);
      dataPayload.append('category', formData.category);
      dataPayload.append('price', formData.price);
      dataPayload.append('discountPrice', formData.discountPrice || '0');
      dataPayload.append('stock', formData.stock);
      dataPayload.append('description', formData.description);
      dataPayload.append('featured', formData.featured.toString());
      dataPayload.append('sizes', formData.sizes);
      dataPayload.append('colors', formData.colors);

      // Append files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          dataPayload.append('images', file);
        });
      } else if (editingProduct) {
        // If editing and no new files uploaded, keep existing images
        dataPayload.append('images', JSON.stringify(editingProduct.images));
      }

      let response;
      if (editingProduct) {
        response = await API.put(`/products/${editingProduct._id}`, dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Product updated successfully!');
      } else {
        response = await API.post('/products', dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('New product created successfully!');
      }

      setModalOpen(false);
      setSubmitting(false);
      fetchProducts();
    } catch (err) {
      setSubmitting(false);
      const errMsg = err.response?.data?.message || err.message || 'Operation failed';
      showToast(errMsg, 'error');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      await API.delete(`/products/${id}`);
      showToast('Product removed successfully');
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Delete failed', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Screen Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h2 className="font-playfair text-2xl font-black text-brand-charcoal">Catalog Management</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Add, edit, or remove store products</p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-1.5 bg-brand-green-500 hover:bg-brand-charcoal text-white font-bold py-3 px-5 rounded text-xs uppercase tracking-widest transition-colors shadow"
          >
            <FiPlus className="h-4.5 w-4.5" /> Add New Product
          </button>
        </div>

        {/* Search controls */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search catalog products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded py-2.5 pl-4 pr-10 text-sm font-sans focus:outline-none focus:border-brand-green-500 transition-colors"
          />
          <FiSearch className="absolute right-3.5 top-3.5 text-gray-400" />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded border border-gray-200 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm font-light text-gray-400 animate-pulse">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-gray-50/50">
                      {/* Image + Title */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-gray-50 border border-gray-100">
                          <img
                            src={prod.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-brand-charcoal line-clamp-1">{prod.title}</p>
                          <p className="text-[10px] text-brand-gold-500 font-bold uppercase tracking-wider">{prod.brand}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">{prod.category}</td>
                      <td className="px-6 py-4 font-bold text-brand-charcoal">
                        {prod.discountPrice > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-brand-green-500">₹{prod.discountPrice}</span>
                            <span className="text-[10px] text-gray-400 line-through">₹{prod.price}</span>
                          </div>
                        ) : (
                          `₹${prod.price}`
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-brand-charcoal">
                        {prod.stock === 0 ? (
                          <span className="text-red-500 font-bold text-[10px] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-200">Sold Out</span>
                        ) : (
                          `${prod.stock} units`
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{prod.ratings.toFixed(1)} / 5.0</td>

                      {/* Edit/Delete Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            aria-label="Edit product"
                          >
                            <FiEdit className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            aria-label="Delete product"
                          >
                            <FiTrash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm font-light text-gray-400">
                      No products found. Add some new products to populate.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

            {/* Modal Body */}
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded shadow-premium p-6 sm:p-8 z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-brand-charcoal">
                    {editingProduct ? `Edit "${formData.title}"` : 'Add New Product'}
                  </h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Fill in product information details</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-brand-charcoal p-1.5 hover:bg-gray-100 rounded">
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Title and Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Traditional Brass Oil Lamp"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Heritage Artisans"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                </div>

                {/* Category and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    >
                      <option value="Fashion">Fashion</option>
                      <option value="Home Decor">Home Decor</option>
                      <option value="Spices & Teas">Spices & Teas</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mobiles">Mobiles</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Skincare">Skincare</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Watches">Watches</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Bags">Bags</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Books">Books</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Sports">Sports</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Organic">Organic</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Kids">Kids</option>
                      <option value="Toys">Toys</option>
                      <option value="Pet Supplies">Pet Supplies</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Travel">Travel</option>
                      <option value="Smart Gadgets">Smart Gadgets</option>
                      <option value="Handmade">Handmade</option>
                      <option value="Kerala Specials">Kerala Specials</option>
                      <option value="Ayurveda">Ayurveda</option>
                      <option value="Traditional Wear">Traditional Wear</option>
                      <option value="Premium Collection">Premium Collection</option>
                      <option value="Limited Edition">Limited Edition</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                </div>

                {/* Price and Discount Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Regular Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                </div>

                {/* Sizes and Colors (comma separated) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Available Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleInputChange}
                      placeholder="e.g. S, M, L or Standard"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Available Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      name="colors"
                      value={formData.colors}
                      onChange={handleInputChange}
                      placeholder="e.g. Gold, Ivory or Teakwood"
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Provide details about craftsmanship, material, dimensions, etc."
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-green-500"
                  />
                </div>

                {/* Image Upload Files */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Product Images *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-md bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="space-y-1.5 text-center">
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-xs text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded font-bold text-brand-green-500 hover:text-brand-gold-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-green-500 px-1 border border-gray-200 shadow-sm">
                          <span>Upload files</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-[10px] text-gray-400">PNG, JPG, JPEG, WEBP up to 5MB</p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mt-3 p-3 bg-gray-50 rounded border border-gray-100">
                      {imagePreviews.map((img, idx) => (
                        <div key={idx} className="relative h-16 w-16 overflow-hidden rounded border border-gray-200 bg-white">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured Product */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="featured"
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4.5 w-4.5 text-brand-green-500 focus:ring-brand-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider select-none">
                    Feature on Homepage
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="border border-gray-200 text-brand-charcoal hover:bg-gray-50 font-bold py-2.5 px-5 rounded text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-green-500 hover:bg-brand-charcoal text-white font-bold py-2.5 px-6 rounded text-xs uppercase tracking-widest transition-colors shadow"
                  >
                    {submitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
