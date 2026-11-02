import React, { useState, useEffect } from "react";
import "./newcollections.css";
import Item from "../item/item";

const NewCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await fetch(
                    "http://localhost:4000/newcollections"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch new collections");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid data received from backend");
                }

                const formatted = data.map((item) => {
                    let img = item.image || "";

                    if (img.startsWith("/src/assets/")) {
                        const filename = img.split("/").pop();
                        img = `http://localhost:4000/images/${filename}`;
                    }

                    return {
                        ...item,
                        image: img
                    };
                });

                setCollections(formatted);
            } catch (err) {
                console.error("Error fetching collections:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    if (loading) {
        return (
            <div className="section-loading">
                <div className="loading-spinner"></div>
                <p>Loading fresh arrivals...</p>
            </div>
        );
    }

    if (error) {
        return <div className="section-error"><p>Unable to load collections: {error}</p></div>;
    }

    return (
        <section className="newcollections">
            <div className="section-header">
                <span className="section-pill">FRESH OFF THE RUNWAY</span>
                <h2 className="section-title">New Collections</h2>
                <div className="section-divider"></div>
            </div>

            <div className="collections">
                {collections.length > 0 ? (
                    collections.map((item) => (
                        <Item
                            key={item._id || item.id}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            old_price={item.old_price}
                            new_price={item.new_price}
                        />
                    ))
                ) : (
                    <p className="no-products">No new collections available right now.</p>
                )}
            </div>
        </section>
    );
};

export default NewCollections;
