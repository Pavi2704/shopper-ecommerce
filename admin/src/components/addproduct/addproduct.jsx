import React, { useState } from 'react';
import './addproduct.css';
import uploadArea from '../../assets/upload_area.svg';
import { useAdmin } from '../../context/AdminContext';
import ListProduct from '../listproduct/listproduct';
import product1 from '../../assets/product_1.png';
import product13 from '../../assets/product_13.png';
import product25 from '../../assets/product_25.png';

const AddProduct = () => {
  const { backendUrl, showToast, fetchProducts, fetchStats } = useAdmin();

  const [image, setImage] = useState(false);
  const [selectedPresetImage, setSelectedPresetImage] = useState('');
  const [loading, setLoading] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: '',
    category: 'women',
    new_price: '',
    old_price: '',
    description: '',
    available: true
  });

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const imageHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setSelectedPresetImage('');
    }
  };

  const handlePresetSelect = (presetPath, defaultCategory, defaultName) => {
    setSelectedPresetImage(presetPath);
    setImage(false);
    if (!productDetails.name) {
      setProductDetails((prev) => ({
        ...prev,
        name: defaultName,
        category: defaultCategory
      }));
    }
  };

  // Calculate discount percentage
  const oldP = Number(productDetails.old_price);
  const newP = Number(productDetails.new_price);
  const discountPercent = oldP > newP && oldP > 0 ? Math.round(((oldP - newP) / oldP) * 100) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productDetails.name.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }
    if (!productDetails.new_price || isNaN(productDetails.new_price)) {
      showToast('Please enter a valid offer price', 'error');
      return;
    }
    if (!productDetails.old_price || isNaN(productDetails.old_price)) {
      showToast('Please enter a valid regular price', 'error');
      return;
    }
    if (!image && !selectedPresetImage) {
      showToast('Please upload or select a product image', 'error');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      if (image) {
        // Upload image to backend
        const formData = new FormData();
        formData.append('product', image);

        const uploadRes = await fetch(`${backendUrl}/upload`, {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.image_url;
        } else {
          showToast(uploadData.message || 'Image upload failed', 'error');
          setLoading(false);
          return;
        }
      } else if (selectedPresetImage) {
        imageUrl = selectedPresetImage;
      }

      // Add product payload
      const payload = {
        ...productDetails,
        image: imageUrl,
        description: productDetails.description || `${productDetails.name} - Premium high quality fabric design.`
      };

      const addRes = await fetch(`${backendUrl}/addproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const addData = await addRes.json();

      if (addData.success) {
        showToast(`Product "${productDetails.name}" added successfully!`, 'success');
        // Reset form
        setProductDetails({
          name: '',
          category: 'women',
          new_price: '',
          old_price: '',
          description: '',
          available: true
        });
        setImage(false);
        setSelectedPresetImage('');

        // Refresh global state
        await fetchProducts();
        await fetchStats();

        // Smooth scroll to the product list below so user can immediately see the added product
        setTimeout(() => {
          const listElem = document.getElementById('all-products-inventory');
          if (listElem) {
            listElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        showToast(addData.message || 'Failed to add product', 'error');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      showToast('Failed to connect to backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container fade-in">
      <div className="add-product-header">
        <div>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Create a new item in your store inventory and publish it live.</p>
        </div>
      </div>

      <form className="add-product-card admin-card" onSubmit={handleSubmit}>
        <div className="form-layout-grid">
          {/* Left Column: Product Details */}
          <div className="form-column">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="product-name">
                Product Title <span className="required">*</span>
              </label>
              <input
                id="product-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Striped Flutter Sleeve Overlap Collar Peplum Top"
                value={productDetails.name}
                onChange={changeHandler}
                required
              />
            </div>

            {/* Category and Stock Status */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="product-category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="product-category"
                  name="category"
                  className="form-select"
                  value={productDetails.category}
                  onChange={changeHandler}
                >
                  <option value="women">Women Fashion</option>
                  <option value="men">Men Fashion</option>
                  <option value="kids">Kids Collection</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Inventory Status</label>
                <label className="toggle-switch-label">
                  <input
                    type="checkbox"
                    name="available"
                    checked={productDetails.available}
                    onChange={changeHandler}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">
                    {productDetails.available ? 'In Stock (Live)' : 'Out of Stock'}
                  </span>
                </label>
              </div>
            </div>

            {/* Price Inputs */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="old-price">
                  Original Price (₹) <span className="required">*</span>
                </label>
                <input
                  id="old-price"
                  name="old_price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 1200"
                  value={productDetails.old_price}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-price">
                  Offer Price (₹) <span className="required">*</span>
                </label>
                <input
                  id="new-price"
                  name="new_price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 850"
                  value={productDetails.new_price}
                  onChange={changeHandler}
                  required
                />
              </div>
            </div>

            {/* Live Discount Callout */}
            {discountPercent > 0 && (
              <div className="discount-pill-callout">
                🎉 Automatic Discount Applied: <strong>{discountPercent}% OFF</strong> (Save ₹{(oldP - newP).toFixed(2)})
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="product-desc">
                Product Description
              </label>
              <textarea
                id="product-desc"
                name="description"
                className="form-textarea"
                placeholder="Write detailed specifications, fabric material, sizing details..."
                value={productDetails.description}
                onChange={changeHandler}
                rows={4}
              ></textarea>
            </div>
          </div>

          {/* Right Column: Image Upload & Preview */}
          <div className="form-column image-column">
            <div className="form-group">
              <label className="form-label">
                Product Media <span className="required">*</span>
              </label>

              <div className="upload-wrapper">
                <label htmlFor="file-input" className="upload-dropzone">
                  {image ? (
                    <div className="preview-container">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Product Preview"
                        className="uploaded-img-preview"
                      />
                      <div className="change-img-overlay">Click to change image</div>
                    </div>
                  ) : selectedPresetImage ? (
                    <div className="preview-container">
                      <img
                        src={selectedPresetImage}
                        alt="Preset Preview"
                        className="uploaded-img-preview"
                      />
                      <div className="change-img-overlay">Preset Selected (Click to change)</div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <img src={uploadArea} alt="Upload area" className="upload-icon" />
                      <p className="upload-prompt">
                        <strong>Click to browse</strong> or drag & drop image
                      </p>
                      <span className="upload-hint">Supports PNG, JPG, WEBP up to 5MB</span>
                    </div>
                  )}
                </label>

                <input
                  onChange={imageHandler}
                  type="file"
                  name="product"
                  id="file-input"
                  accept="image/*"
                  hidden
                />

                {(image || selectedPresetImage) && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm remove-img-btn"
                    onClick={() => {
                      setImage(false);
                      setSelectedPresetImage('');
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {/* Quick Demo Image Selector */}
            <div className="quick-presets-box">
              <span className="presets-title">Or pick a quick demo style:</span>
              <div className="presets-grid">
                <div
                  className={`preset-thumb ${selectedPresetImage === `${backendUrl}/images/product_1.png` ? 'selected' : ''}`}
                  onClick={() => handlePresetSelect(`${backendUrl}/images/product_1.png`, 'women', 'Striped Flutter Sleeve Peplum Blouse')}
                  title="Women Floral Blouse"
                >
                  <img src={`${backendUrl}/images/product_1.png`} alt="Women style" />
                  <span>Women</span>
                </div>
                <div
                  className={`preset-thumb ${selectedPresetImage === `${backendUrl}/images/product_13.png` ? 'selected' : ''}`}
                  onClick={() => handlePresetSelect(`${backendUrl}/images/product_13.png`, 'men', 'Men Slim Fit Urban Bomber Jacket')}
                  title="Men Bomber Jacket"
                >
                  <img src={`${backendUrl}/images/product_13.png`} alt="Men style" />
                  <span>Men</span>
                </div>
                <div
                  className={`preset-thumb ${selectedPresetImage === `${backendUrl}/images/product_25.png` ? 'selected' : ''}`}
                  onClick={() => handlePresetSelect(`${backendUrl}/images/product_25.png`, 'kids', 'Boys Colourblocked Hooded Sweatshirt')}
                  title="Kids Hooded Pullover"
                >
                  <img src={`${backendUrl}/images/product_25.png`} alt="Kids style" />
                  <span>Kids</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-submit-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setProductDetails({
                name: '',
                category: 'women',
                new_price: '',
                old_price: '',
                description: '',
                available: true
              });
              setImage(false);
              setSelectedPresetImage('');
            }}
          >
            Clear Form
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? (
              <>
                <span className="spinning">↻</span> Uploading & Publishing...
              </>
            ) : (
              'Publish Product to Store'
            )}
          </button>
        </div>
      </form>

      {/* ALL PRODUCT LIST DIRECTLY UNDER ADD NEW PRODUCT */}
      <section className="add-product-list-section" id="all-products-inventory">
        <div className="section-divider-bar">
          <div className="section-divider-content">
            <div className="section-divider-badge">
              <span className="live-dot"></span> Live Store Inventory
            </div>
            <h2 className="section-divider-title">All Products List</h2>
            <p className="section-divider-desc">
              All products entered in "Add New Product" are listed here and shown on the website for selling. Each product displays its old price, new price, category, and can be removed directly from the list.
            </p>
          </div>
        </div>

        <ListProduct
          hideAddBtn={true}
          title="All Products List"
          subtitle="Showing all items currently active in store inventory for selling"
        />
      </section>
    </div>
  );
};

export default AddProduct;
