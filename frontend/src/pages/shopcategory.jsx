import React, { useContext, useState } from "react";
import "./css/shopcategory.css";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/item/item";

const ShopCategory = (props) => {
    const context = useContext(ShopContext);
    const all_product = context?.all_product || [];
    const [sortOption, setSortOption] = useState("default");

    let categoryProducts = all_product.filter(
        (item) => props.category?.toLowerCase() === item.category?.toLowerCase()
    );

    if (sortOption === "low-to-high") {
        categoryProducts = [...categoryProducts].sort((a, b) => a.new_price - b.new_price);
    } else if (sortOption === "high-to-low") {
        categoryProducts = [...categoryProducts].sort((a, b) => b.new_price - a.new_price);
    }

    const categoryTitle = props.category
        ? props.category.charAt(0).toUpperCase() + props.category.slice(1)
        : "Products";

    return (
        <div className="shop-category">
            {/* Banner Container */}
            <div className="shopcategory-banner-wrapper">
                <img src={props.banner} alt={`${categoryTitle} Collection`} className="shopcategory-banner" />
            </div>

            <div className="shopcategory-content">
                <div className="shopcategory-indexSort">
                    <div className="category-meta-info">
                        <h2>{categoryTitle}'s Collection</h2>
                        <p>
                            Showing <span>{categoryProducts.length > 0 ? `1-${categoryProducts.length}` : "0"}</span> of {categoryProducts.length} items
                        </p>
                    </div>

                    <div className="shopcategory-sort-wrapper">
                        <label htmlFor="sortSelect" className="sort-label">Sort By:</label>
                        <select
                            id="sortSelect"
                            className="shopcategory-sort-select"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="default">Featured & Latest</option>
                            <option value="low-to-high">Price: Low to High</option>
                            <option value="high-to-low">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="shopcategory-products">
                    {categoryProducts.length > 0 ? (
                        categoryProducts.map((item, i) => (
                            <Item
                                key={item.id || i}
                                id={item.id}
                                name={item.name}
                                image={item.image}
                                new_price={item.new_price}
                                old_price={item.old_price}
                            />
                        ))
                    ) : (
                        <div className="no-products-state">
                            <span className="no-prod-icon">🛍️</span>
                            <h3>No products found in this category yet.</h3>
                            <p>Check back shortly for new curated styles in {props.category}!</p>
                        </div>
                    )}
                </div>

                {categoryProducts.length > 12 && (
                    <div className="shopcategory-loadmore">
                        <span>Discover More</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopCategory;
