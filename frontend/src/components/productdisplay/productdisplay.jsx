import React, { useContext, useState } from "react";
import "./productdisplay.css";
import star_icon from "../assets/star_icon.png";
import star_dull_icon from "../assets/star_dull_icon.png";
import { ShopContext } from "../../context/ShopContext";

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    const [selectedSize, setSelectedSize] = useState("");
    const [sizeError, setSizeError] = useState("");
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [activeImg, setActiveImg] = useState("");

    if (!product) {
        return (
            <div className="product-loading-container">
                <div className="loading-spinner"></div>
                <h2>Loading product details...</h2>
            </div>
        );
    }

    const sizes = ["S", "M", "L", "XL", "XXL"];
    const fallbackImg = "https://shopper-backend-ne59.onrender.com/images/product_1.png";
    const displayImg = activeImg || product.image || fallbackImg;

    const hasDiscount = product.old_price && product.old_price > product.new_price;
    const discountPercent = hasDiscount
        ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
        : 0;

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError("Please select your size before adding to cart");
            return;
        }

        addToCart(product.id, selectedSize);
        setSizeError("");
        setAddedSuccess(true);
        setTimeout(() => {
            setAddedSuccess(false);
        }, 3000);
    };

    return (
        <div className="productdisplay">
            {/* Left: Image Gallery */}
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {[product.image, product.image, product.image, product.image].map((img, idx) => (
                        <div
                            key={idx}
                            className={`thumb-wrapper ${displayImg === img ? "active-thumb" : ""}`}
                            onClick={() => setActiveImg(img)}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                onError={(e) => { e.target.src = fallbackImg; }}
                            />
                        </div>
                    ))}
                </div>

                <div className="productdisplay-img">
                    {hasDiscount && (
                        <span className="product-save-badge">
                            SAVE {discountPercent}%
                        </span>
                    )}
                    <img
                        className="productdisplay-main-img"
                        src={displayImg}
                        alt={product.name}
                        onError={(e) => { e.target.src = fallbackImg; }}
                    />
                </div>
            </div>

            {/* Right: Product Info & Actions */}
            <div className="productdisplay-right">
                <div className="product-meta-header">
                    <span className="product-category-tag">
                        {product.category ? product.category.toUpperCase() : "APPAREL"}
                    </span>
                    <span className="product-stock-tag">✓ In Stock • Ready To Ship</span>
                </div>

                <h1 className="product-name">{product.name}</h1>

                <div className="productdisplay-right-star">
                    <div className="stars-row">
                        <img src={star_icon} alt="Star" />
                        <img src={star_icon} alt="Star" />
                        <img src={star_icon} alt="Star" />
                        <img src={star_icon} alt="Star" />
                        <img src={star_dull_icon} alt="Star dull" />
                    </div>
                    <span className="review-count">(136 Verified Customer Reviews)</span>
                </div>

                <div className="productdisplay-right-prices">
                    <span className="product-price-current">₹{product.new_price}</span>
                    {hasDiscount && (
                        <span className="product-price-original">₹{product.old_price}</span>
                    )}
                    {hasDiscount && (
                        <span className="price-discount-pill">
                            {discountPercent}% OFF
                        </span>
                    )}
                </div>
                <p className="tax-inclusive-text">Inclusive of all taxes • Cash on Delivery eligible</p>

                <div className="productdisplay-right-description">
                    <p>
                        {product.description || "Crafted from exceptionally soft, breathable cotton weave designed for effortless style and lasting comfort. Features precision tailoring with a timeless silhouette suitable for any casual or semi-formal gathering."}
                    </p>
                </div>

                {/* Size Selector */}
                <div className="productdisplay-size-section">
                    <div className="size-header">
                        <span className="size-label">Select Size</span>
                        {selectedSize && <span className="selected-size-text">Selected: <strong>{selectedSize}</strong></span>}
                    </div>

                    <div className="productdisplay-right-sizes">
                        {sizes.map((size) => (
                            <button
                                type="button"
                                key={size}
                                className={`productdisplay-right-size-box ${selectedSize === size ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedSize(size);
                                    setSizeError("");
                                }}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {sizeError && (
                    <div className="productdisplay-size-error">
                        ⚠️ {sizeError}
                    </div>
                )}

                {addedSuccess && (
                    <div className="productdisplay-added-success">
                        ✓ Added to bag! Size: <strong>{selectedSize}</strong> • Check your cart anytime.
                    </div>
                )}

                <div className="product-actions-group">
                    <button onClick={handleAddToCart} className="productdisplay-cart-btn">
                        <span className="btn-cart-icon">🛍️</span>
                        <span>ADD TO CART</span>
                    </button>
                </div>

                {/* Reassurance Grid */}
                <div className="product-reassurance">
                    <div className="reassurance-item">
                        <span className="reassurance-icon">💵</span>
                        <div className="reassurance-text">
                            <strong>Cash On Delivery</strong>
                            <span>Pay at your doorstep with zero upfront cost</span>
                        </div>
                    </div>

                    <div className="reassurance-item">
                        <span className="reassurance-icon">🚚</span>
                        <div className="reassurance-text">
                            <strong>Free Express Delivery</strong>
                            <span>Dispatched within 24 hours</span>
                        </div>
                    </div>

                    <div className="reassurance-item">
                        <span className="reassurance-icon">🔄</span>
                        <div className="reassurance-text">
                            <strong>30 Days Return Window</strong>
                            <span>Simple, no-questions-asked returns</span>
                        </div>
                    </div>
                </div>

                <div className="product-meta-footer">
                    <p><span>Category:</span> {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "General"}, T-Shirt, Premium</p>
                    <p><span>Tags:</span> Modern, Summer Edit, Best Seller, New Trend</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDisplay;
