import React, { useContext, useState } from "react";
import "./cartitems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../assets/cart_cross_icon.png";
import { Link } from "react-router-dom";

const CartItems = () => {
    const {
        backendUrl,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalCartItems
    } = useContext(ShopContext);

    // Checkout Modal states
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedOrderData, setConfirmedOrderData] = useState(null);

    // Promo code state
    const [promoCode, setPromoCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [promoMessage, setPromoMessage] = useState("");

    // Delivery details form state
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        orderNotes: ""
    });

    const currentBackendUrl = backendUrl || "https://shopper-backend-ne59.onrender.com";
    const fallbackImg = `${currentBackendUrl}/images/product_1.png`;

    // Filter items in cart
    const itemsInCart = all_product.filter((item) => cartItems[item.id] > 0);

    const handleApplyPromo = (e) => {
        e.preventDefault();
        const code = promoCode.trim().toUpperCase();
        if (code === "SHOPPER10" || code === "FIRST10") {
            const disc = Math.round(getTotalCartAmount() * 0.1);
            setDiscountAmount(disc);
            setPromoMessage(`✓ Coupon applied! Saved ₹${disc}`);
        } else if (code === "") {
            setPromoMessage("Please enter a promo code");
        } else {
            setDiscountAmount(0);
            setPromoMessage("❌ Invalid coupon code. Try 'SHOPPER10'");
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const isLoggedIn = !!localStorage.getItem("auth-token");

    const handleOpenCheckout = () => {
        if (getTotalCartItems() === 0) {
            alert("Your cart is empty! Please add products before checking out.");
            return;
        }

        if (!localStorage.getItem("auth-token")) {
            sessionStorage.setItem("redirectAfterLogin", "/cart");
            alert("Please sign in or create an account before checking out!");
            window.location.href = "/login";
            return;
        }

        setIsCheckoutOpen(true);
        setOrderConfirmed(false);
    };

    const handleCloseCheckout = () => {
        setIsCheckoutOpen(false);
        if (orderConfirmed) {
            setOrderConfirmed(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!localStorage.getItem("auth-token")) {
            sessionStorage.setItem("redirectAfterLogin", "/cart");
            alert("Please sign in or create an account before placing an order.");
            window.location.href = "/login";
            return;
        }

        if (!formData.fullName || !formData.phone || !formData.email || !formData.street || !formData.city || !formData.zipCode) {
            alert("Please fill in all mandatory delivery fields.");
            return;
        }

        setIsSubmitting(true);

        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const orderSummaryItems = itemsInCart.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            new_price: item.new_price,
            quantity: cartItems[item.id]
        }));

        const finalAmount = Math.max(0, getTotalCartAmount() - discountAmount);

        const orderPayload = {
            orderId: orderId,
            userId: localStorage.getItem("auth-token") ? "registered-user" : "guest",
            customerName: formData.fullName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state || "Default State",
                zipCode: formData.zipCode,
                country: "India"
            },
            items: orderSummaryItems,
            amount: finalAmount,
            status: "Order Placed",
            paymentMethod: "Cash on Delivery",
            isPaid: false
        };

        // Try submitting to backend endpoint if running
        try {
            await fetch(`${currentBackendUrl}/placeorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(orderPayload)
            });
        } catch (err) {
            console.warn("Backend order placement simulated:", err.message);
        }

        setConfirmedOrderData({
            orderId: orderId,
            items: orderSummaryItems,
            totalAmount: finalAmount,
            customer: formData,
            date: new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })
        });

        // Clear cart so cart becomes 0
        clearCart();
        setIsSubmitting(false);
        setOrderConfirmed(true);
    };

    const finalPayable = Math.max(0, getTotalCartAmount() - discountAmount);

    return (
        <div className="cartitems-wrapper">
            <div className="cartitems-page-header">
                <span className="cart-badge-pill">YOUR SHOPPING BAG</span>
                <h1>Cart Overview ({getTotalCartItems()} items)</h1>
            </div>

            {getTotalCartItems() === 0 ? (
                <div className="cartitems-empty-state">
                    <div className="empty-cart-icon">🛍️</div>
                    <h2>Your shopping cart is empty</h2>
                    <p>Looks like you haven't added any luxury pieces to your cart yet.</p>
                    <Link to="/" className="continue-shopping-btn">
                        Explore Trending Styles
                    </Link>
                </div>
            ) : (
                <div className="cartitems-content">
                    {/* Items Table */}
                    <div className="cartitems-left-col">
                        <div className="cartitems-table-header">
                            <span>Item</span>
                            <span>Details</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                            <span></span>
                        </div>

                        <div className="cartitems-list">
                            {itemsInCart.map((e) => (
                                <div key={e.id} className="cartitem-card">
                                    <div className="cartitem-img-cell">
                                        <img
                                            src={e.image}
                                            alt={e.name}
                                            className="cartitem-thumbnail"
                                            onError={(evt) => { evt.target.src = fallbackImg; }}
                                        />
                                    </div>

                                    <div className="cartitem-info-cell">
                                        <h3 className="cartitem-name">{e.name}</h3>
                                        <span className="cartitem-category-tag">
                                            {e.category ? e.category.toUpperCase() : "APPAREL"}
                                        </span>
                                        <div className="cartitem-mobile-price">
                                            ₹{e.new_price} each
                                        </div>
                                    </div>

                                    <div className="cartitem-price-cell">
                                        ₹{e.new_price}
                                    </div>

                                    <div className="cartitem-qty-cell">
                                        <div className="qty-counter-box">
                                            <button
                                                type="button"
                                                className="qty-btn"
                                                onClick={() => removeFromCart(e.id)}
                                                title="Decrease Quantity"
                                            >
                                                −
                                            </button>
                                            <span className="qty-value">{cartItems[e.id]}</span>
                                            <button
                                                type="button"
                                                className="qty-btn"
                                                onClick={() => addToCart(e.id)}
                                                title="Increase Quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cartitem-total-cell">
                                        ₹{e.new_price * cartItems[e.id]}
                                    </div>

                                    <div className="cartitem-remove-cell">
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeFromCart(e.id)}
                                            title="Remove item"
                                        >
                                            <img src={remove_icon} alt="Remove" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promo Box */}
                        <div className="cartitems-promocode-card">
                            <div className="promo-header">
                                <span className="promo-icon">🏷️</span>
                                <div>
                                    <h4>Have a Promo Code or Voucher?</h4>
                                    <p>Use code <strong>SHOPPER10</strong> for 10% instant savings</p>
                                </div>
                            </div>
                            <form className="promobox-form" onSubmit={handleApplyPromo}>
                                <input
                                    type="text"
                                    placeholder="Enter discount coupon"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button type="submit">Apply</button>
                            </form>
                            {promoMessage && (
                                <p className={`promo-feedback ${discountAmount > 0 ? "success" : "error"}`}>
                                    {promoMessage}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary & Checkout Trigger */}
                    <div className="cartitems-right-col">
                        <div className="cart-summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-breakdown">
                                <div className="summary-row">
                                    <span>Bag Subtotal ({getTotalCartItems()} items)</span>
                                    <span>₹{getTotalCartAmount()}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="summary-row discount-row">
                                        <span>Coupon Discount (10%)</span>
                                        <span>- ₹{discountAmount}</span>
                                    </div>
                                )}

                                <div className="summary-row">
                                    <span>Estimated Shipping</span>
                                    <span className="free-shipping-tag">FREE</span>
                                </div>

                                <div className="summary-row cod-free-row">
                                    <span>Cash On Delivery Fee</span>
                                    <span className="free-shipping-tag">FREE</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-row total-row">
                                    <span>Estimated Total</span>
                                    <span className="total-amount">₹{finalPayable}</span>
                                </div>
                                <p className="taxes-note">Inclusive of all local taxes & shipping</p>
                            </div>

                            {/* COD Reassurance Badge */}
                            <div className="cart-cod-pill">
                                <span className="cod-check">✓</span>
                                <span>Cash On Delivery Available for this order</span>
                            </div>

                            {!isLoggedIn && (
                                <div className="cart-login-required-notice">
                                    <span>🔒 Please sign in before proceeding to checkout</span>
                                </div>
                            )}

                            <button
                                className={`checkout-trigger-btn ${!isLoggedIn ? "login-btn-state" : ""}`}
                                onClick={handleOpenCheckout}
                            >
                                <span>{isLoggedIn ? "PROCEED TO CHECKOUT" : "SIGN IN TO CHECKOUT"}</span>
                                <span className="btn-arrow-icon">→</span>
                            </button>

                            <div className="summary-perks">
                                <p>🔒 100% Secure Checkout</p>
                                <p>🚚 Free Standard Doorstep Delivery</p>
                                <p>💵 No Upfront Online Payment Needed</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DUMMY CHECKOUT MODAL (ONLY CASH ON DELIVERY) */}
            {isCheckoutOpen && (
                <div className="checkout-modal-overlay" onClick={handleCloseCheckout}>
                    <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseCheckout} title="Close">
                            ✕
                        </button>

                        {!orderConfirmed ? (
                            <div className="checkout-modal-body">
                                <div className="checkout-modal-header">
                                    <span className="checkout-pill">STEP 1 OF 1 • INSTANT CHECKOUT</span>
                                    <h2>Cash On Delivery Checkout</h2>
                                    <p>Fill in your delivery address below. Pay cash when your parcel arrives!</p>
                                </div>

                                <form className="checkout-form" onSubmit={handlePlaceOrder}>
                                    <div className="checkout-grid">
                                        {/* Left Side: Delivery Details */}
                                        <div className="form-section">
                                            <h3 className="section-subtitle">1. Delivery Address</h3>

                                            <div className="form-group">
                                                <label>Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="e.g. Rahul Sharma"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Phone Number *</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        placeholder="+91 98765 43210"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Email Address *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="name@example.com"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Street Address / House No. *</label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    placeholder="Flat / House No., Apartment, Street"
                                                    value={formData.street}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>City *</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        placeholder="e.g. Mumbai"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Postal / PIN Code *</label>
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        placeholder="400001"
                                                        value={formData.zipCode}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Delivery Instructions (Optional)</label>
                                                <input
                                                    type="text"
                                                    name="orderNotes"
                                                    placeholder="e.g. Leave package with security guard"
                                                    value={formData.orderNotes}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Side: Payment Method (COD ONLY) & Order Confirmation */}
                                        <div className="payment-section">
                                            <h3 className="section-subtitle">2. Payment Method</h3>

                                            {/* Dedicated COD Selection Card */}
                                            <div className="payment-option-card selected">
                                                <div className="payment-radio-row">
                                                    <div className="custom-radio active">
                                                        <span className="radio-dot"></span>
                                                    </div>
                                                    <div className="payment-info">
                                                        <div className="payment-title-row">
                                                            <span className="payment-name">💵 Cash On Delivery (COD)</span>
                                                            <span className="active-cod-tag">AVAILABLE</span>
                                                        </div>
                                                        <p className="payment-desc">
                                                            Pay with cash directly to our delivery courier when your order reaches your door. No upfront card payment or net banking required!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Disabled Other Option to emphasize COD exclusivity */}
                                            <div className="payment-option-card disabled">
                                                <div className="payment-radio-row">
                                                    <div className="custom-radio disabled"></div>
                                                    <div className="payment-info">
                                                        <div className="payment-title-row">
                                                            <span className="payment-name-disabled">💳 Online Card / UPI Payment</span>
                                                            <span className="disabled-tag">Unavailable</span>
                                                        </div>
                                                        <p className="payment-desc">
                                                            Temporarily offline. Only Cash on Delivery is currently supported for this order.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Snapshot */}
                                            <div className="checkout-summary-box">
                                                <div className="snapshot-header">
                                                    <span>Order Items ({getTotalCartItems()})</span>
                                                    <span>₹{finalPayable}</span>
                                                </div>
                                                <div className="snapshot-items">
                                                    {itemsInCart.map((item) => (
                                                        <div key={item.id} className="snapshot-item-row">
                                                            <span className="item-name-qty">
                                                                {item.name} × {cartItems[item.id]}
                                                            </span>
                                                            <span className="item-price">
                                                                ₹{item.new_price * cartItems[item.id]}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="snapshot-total-row">
                                                    <div>
                                                        <strong>Total Payable (COD):</strong>
                                                        <p className="cod-hint">Keep exact cash ready upon delivery</p>
                                                    </div>
                                                    <span className="snapshot-total-val">₹{finalPayable}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="confirm-order-btn"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <span>Placing Order...</span>
                                                ) : (
                                                    <span>Confirm Order (Cash on Delivery)</span>
                                                )}
                                            </button>

                                            <p className="safety-note">
                                                🛡️ By clicking confirm, you agree to accept and pay cash upon delivery.
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            /* ORDER SUCCESS CONFIRMATION VIEW */
                            <div className="order-success-view">
                                <div className="success-icon-badge">✓</div>
                                <span className="success-pill">ORDER PLACED SUCCESSFULLY</span>
                                <h2>Thank you for your order!</h2>
                                <p className="success-subtitle">
                                    Your order has been recorded. Our courier partner will deliver your parcel soon!
                                </p>

                                <div className="order-details-card">
                                    <div className="order-detail-header">
                                        <div>
                                            <span className="label">Order Reference ID</span>
                                            <h3 className="order-id-text">{confirmedOrderData?.orderId}</h3>
                                        </div>
                                        <span className="cod-verified-badge">💵 Cash On Delivery</span>
                                    </div>

                                    <div className="order-details-grid">
                                        <div className="detail-col">
                                            <span className="label">Amount to Pay in Cash</span>
                                            <span className="value-highlight">₹{confirmedOrderData?.totalAmount}</span>
                                        </div>

                                        <div className="detail-col">
                                            <span className="label">Estimated Delivery</span>
                                            <span className="value">Within 3-5 Business Days</span>
                                        </div>

                                        <div className="detail-col">
                                            <span className="label">Recipient Name</span>
                                            <span className="value">{confirmedOrderData?.customer?.fullName}</span>
                                        </div>

                                        <div className="detail-col">
                                            <span className="label">Contact Phone</span>
                                            <span className="value">{confirmedOrderData?.customer?.phone}</span>
                                        </div>

                                        <div className="detail-col full-width">
                                            <span className="label">Delivery Address</span>
                                            <span className="value">
                                                {confirmedOrderData?.customer?.street}, {confirmedOrderData?.customer?.city} - {confirmedOrderData?.customer?.zipCode}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="cod-instructions">
                                        <strong>📌 Cash On Delivery Instructions:</strong>
                                        <ul>
                                            <li>Our courier will call or SMS you on <strong>{confirmedOrderData?.customer?.phone}</strong> prior to delivery.</li>
                                            <li>Please keep <strong>₹{confirmedOrderData?.totalAmount}</strong> in cash ready to hand over to the delivery partner.</li>
                                            <li>You can inspect the sealed package before making the cash payment.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="success-actions">
                                    <button
                                        type="button"
                                        className="continue-btn"
                                        onClick={() => {
                                            handleCloseCheckout();
                                            window.location.href = "/";
                                        }}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartItems;
