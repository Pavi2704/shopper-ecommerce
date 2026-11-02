import React, { useState } from "react";
import "./descriptionbox.css";

const DescriptionBox = () => {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="descriptionbox">
            <div className="descriptionbox-navigator">
                <button
                    className={`descriptionbox-nav-box ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => setActiveTab("description")}
                >
                    Product Description
                </button>
                <button
                    className={`descriptionbox-nav-box ${activeTab === "reviews" ? "active" : ""}`}
                    onClick={() => setActiveTab("reviews")}
                >
                    Customer Reviews (136)
                </button>
            </div>

            <div className="descriptionbox-content">
                {activeTab === "description" ? (
                    <div className="descriptionbox-description">
                        <p>
                            SHOPPER brings modern luxury within reach. Each product in our collection is curated with an eye for contemporary silhouette, premium textile durability, and versatile everyday styling. Whether you are building a capsule wardrobe or selecting a statement piece, our garments are pre-shrunk, color-fast, and tested for exceptional handfeel.
                        </p>
                        <div className="description-features">
                            <div className="feature-pill">✦ 100% Breathable Combed Cotton</div>
                            <div className="feature-pill">✦ Reinforced Double-Stitched Seams</div>
                            <div className="feature-pill">✦ Pre-Shrunk Bio-Washed Fabric</div>
                            <div className="feature-pill">✦ Tagless Collar for Comfort</div>
                        </div>
                    </div>
                ) : (
                    <div className="descriptionbox-reviews">
                        <div className="review-summary-bar">
                            <span className="review-avg">4.9 ★</span>
                            <div>
                                <h4>Highly Rated by Shoppers</h4>
                                <p>Based on 136 verified buyer ratings across India</p>
                            </div>
                        </div>
                        <div className="sample-reviews">
                            <div className="review-card">
                                <div className="reviewer-header">
                                    <strong>Ananya Sharma</strong>
                                    <span className="verified-badge">✓ Verified Buyer</span>
                                </div>
                                <div className="stars">★★★★★</div>
                                <p>"The fabric feel is unbelievable for this price! Size M fit true to description, and delivery arrived via COD in just 2 days."</p>
                            </div>
                            <div className="review-card">
                                <div className="reviewer-header">
                                    <strong>Rohan Verma</strong>
                                    <span className="verified-badge">✓ Verified Buyer</span>
                                </div>
                                <div className="stars">★★★★★</div>
                                <p>"Super comfortable and color didn't fade at all after 3 washes. Will definitely buy more colors."</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DescriptionBox;
