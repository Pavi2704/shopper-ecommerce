import React, { useState, useEffect } from "react";
import "./popular.css";
import Item from "../item/item";

const Popular = () => {
    const backendUrl = "https://shopper-backend-ne59.onrender.com";
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                const response = await fetch(
                    `${backendUrl}/popularinwomen`
                );

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid data received from backend");
                }

                const formatted = data.map((item) => {
                    let img = item.image || "";

                    if (img.startsWith("/src/assets/")) {
                        const filename = img.split("/").pop();
                        img = `${backendUrl}/images/${filename}`;
                    } else if (img.includes("localhost:4000")) {
                        img = img.replace("http://localhost:4000", backendUrl);
                    }

                    return {
                        ...item,
                        image: img
                    };
                });

                setPopularProducts(formatted);
            } catch (err) {
                console.error("Failed to fetch popular products:", err);
                setError(err.message || "Unable to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchPopularProducts();
    }, []);

    if (loading) {
        return (
            <div className="section-loading">
                <div className="loading-spinner"></div>
                <p>Curating popular styles...</p>
            </div>
        );
    }

    if (error) {
        return <div className="section-error"><p>Unable to load popular styles: {error}</p></div>;
    }

    return (
        <section className="popular">
            <div className="section-header">
                <span className="section-pill">TRENDING SPOTLIGHT</span>
                <h2 className="section-title">Popular In Women</h2>
                <div className="section-divider"></div>
            </div>

            <div className="popular-item">
                {popularProducts.length > 0 ? (
                    popularProducts.map((item) => (
                        <Item
                            key={item._id || item.id}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                        />
                    ))
                ) : (
                    <p className="no-products">No popular products available right now.</p>
                )}
            </div>
        </section>
    );
};

export default Popular;
