import React from "react";
import "./item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
    const hasDiscount = props.old_price && props.old_price > props.new_price;
    const discountPercent = hasDiscount
        ? Math.round(((props.old_price - props.new_price) / props.old_price) * 100)
        : 0;

    return (
        <div className="item-card">
            <div className="item-image-container">
                <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <img
                        src={props.image}
                        alt={props.name}
                        className="item-img"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = "https://shopper-backend-ne59.onrender.com/images/product_1.png";
                        }}
                    />
                </Link>

                {hasDiscount && (
                    <span className="item-discount-badge">
                        -{discountPercent}% OFF
                    </span>
                )}

                <Link
                    to={`/product/${props.id}`}
                    className="item-hover-btn"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    View Details
                </Link>
            </div>

            <div className="item-details">
                <Link
                    to={`/product/${props.id}`}
                    className="item-title-link"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <h3 className="item-title">{props.name}</h3>
                </Link>

                <div className="item-prices">
                    <span className="item-price-new">₹{props.new_price}</span>
                    {hasDiscount && (
                        <span className="item-price-old">₹{props.old_price}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Item;
