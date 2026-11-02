import React, { useState, useMemo } from 'react';
import './listproduct.css';
import { useAdmin } from '../../context/AdminContext';
import crossIcon from '../../assets/cross_icon.png';
import { Link } from 'react-router-dom';

const ListProduct = ({
  hideAddBtn = false,
  title = "Products Inventory",
  subtitle = "Manage, edit, filter, and track all live store items."
}) => {
  const { backendUrl, products, fetchProducts, showToast, fetchStats, loading } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: 'women',
    new_price: '',
    old_price: '',
    description: '',
    available: true
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState(null);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        const matchesSearch =
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id?.toString().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();

        // Stock filter
        const matchesStock =
          stockFilter === 'all' ||
          (stockFilter === 'in_stock' && p.available !== false) ||
          (stockFilter === 'out_of_stock' && p.available === false);

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
        if (sortBy === 'price_low') return Number(a.new_price || 0) - Number(b.new_price || 0);
        if (sortBy === 'price_high') return Number(b.new_price || 0) - Number(a.new_price || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  // Remove Product
  const handleRemoveProduct = async (id, name) => {
    try {
      const res = await fetch(`${backendUrl}/removeproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: Number(id) })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Product "${name || id}" removed successfully`, 'success');
        fetchProducts();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to remove product', 'error');
      }
    } catch (err) {
      console.error('Error removing product:', err);
      showToast('Error connecting to backend', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle Availability
  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`${backendUrl}/toggleavailability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: product.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `Product is now ${data.available ? 'In Stock' : 'Out of Stock'}`,
          'info'
        );
        fetchProducts();
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      showToast('Could not update status', 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      category: product.category || 'women',
      new_price: product.new_price || '',
      old_price: product.old_price || '',
      description: product.description || '',
      available: product.available !== false
    });
  };

  // Submit Edit Modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setEditLoading(true);
    try {
      const res = await fetch(`${backendUrl}/updateproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingProduct.id,
          ...editFormData,
          image: editingProduct.image
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Product updated successfully!', 'success');
        setEditingProduct(null);
        fetchProducts();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to update product', 'error');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      showToast('Could not save product update', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="list-product-container fade-in">
      {/* Page Header */}
      <div className="list-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline btn-sm" onClick={fetchProducts} disabled={loading}>
            <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>↻</span> Refresh
          </button>
          {!hideAddBtn && (
            <Link to="/addproduct" className="btn btn-primary btn-sm">
              + Add Product
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-card admin-card">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search products by title, ID, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="filters-row">
          {/* Category Chips */}
          <div className="category-pills">
            {['all', 'women', 'men', 'kids'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="filter-dropdowns">
            {/* Stock Filter */}
            <select
              className="form-select filter-select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Availability</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock Only</option>
            </select>

            {/* Sort Filter */}
            <select
              className="form-select filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Counter */}
      <div className="results-count-bar">
        <span>
          Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> total products
        </span>
      </div>

      {/* Products Table Card */}
      <div className="admin-card table-card">
        {filteredProducts.length === 0 ? (
          <div className="empty-products-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>Try adjusting your search query or category filters, or add a new product.</p>
            <Link to="/addproduct" className="btn btn-primary btn-sm">
              Add New Product
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Thumbnail</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Pricing</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const discount =
                    product.old_price > product.new_price && product.old_price > 0
                      ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
                      : 0;

                  return (
                    <tr key={product._id || product.id}>
                      {/* Image Thumbnail */}
                      <td>
                        <div className="product-thumb-wrapper">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumb-img"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/80x80?text=Shopper';
                            }}
                          />
                        </div>
                      </td>

                      {/* Product Details */}
                      <td>
                        <div className="product-info-cell">
                          <div className="product-title-row">
                            <span className="product-id-tag">#{product.id}</span>
                            <span className="product-title">{product.name}</span>
                          </div>
                          {product.description && (
                            <p className="product-snippet">{product.description}</p>
                          )}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td>
                        <span
                          className={`badge ${
                            product.category?.toLowerCase() === 'women'
                              ? 'badge-danger'
                              : product.category?.toLowerCase() === 'men'
                              ? 'badge-purple'
                              : 'badge-warning'
                          }`}
                        >
                          {product.category}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td>
                        <div className="pricing-cell">
                          <span className="price-offer">₹{Number(product.new_price).toFixed(2)}</span>
                          {product.old_price > product.new_price && (
                            <div className="price-sub-row">
                              <span className="price-original">₹{Number(product.old_price).toFixed(2)}</span>
                              <span className="price-discount-tag">-{discount}%</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stock Switch */}
                      <td>
                        <button
                          type="button"
                          className={`stock-status-pill ${product.available !== false ? 'in-stock' : 'out-of-stock'}`}
                          onClick={() => handleToggleStock(product)}
                          title="Click to toggle stock status"
                        >
                          <span className="stock-dot"></span>
                          <span>{product.available !== false ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="action-buttons-cell">
                          <button
                            type="button"
                            className="btn btn-outline btn-sm action-btn edit-btn"
                            onClick={() => handleOpenEdit(product)}
                            title="Edit Product"
                          >
                            ✎ Edit
                          </button>

                          {deletingId === product.id ? (
                            <div className="confirm-delete-box">
                              <span className="confirm-text">Delete?</span>
                              <button
                                className="btn btn-danger btn-sm confirm-btn"
                                onClick={() => handleRemoveProduct(product.id, product.name)}
                              >
                                Yes
                              </button>
                              <button
                                className="btn btn-secondary btn-sm cancel-btn"
                                onClick={() => setDeletingId(null)}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm action-btn delete-btn"
                              onClick={() => setDeletingId(product.id)}
                              title="Delete Product"
                            >
                              <img src={crossIcon} alt="Delete" className="cross-icon" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Product #{editingProduct.id}</h3>
              <button className="modal-close-btn" onClick={() => setEditingProduct(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Availability</label>
                    <select
                      className="form-select"
                      value={editFormData.available ? 'true' : 'false'}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, available: e.target.value === 'true' })
                      }
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Regular Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={editFormData.old_price}
                      onChange={(e) => setEditFormData({ ...editFormData, old_price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Offer Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={editFormData.new_price}
                      onChange={(e) => setEditFormData({ ...editFormData, new_price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={3}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
