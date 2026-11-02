import React from "react";
import "./hero.css";
import hand_icon from "../assets/hand_icon.png";
import heroImage from "../assets/hero_image.png";
import arrow_icon from "../assets/arrow.png";

const Hero = () => {
    const scrollToCollections = () => {
        const collectionsElement = document.querySelector(".newcollections");
        if (collectionsElement) {
            collectionsElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-left">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        NEW SEASON ARRIVALS 2026
                    </div>

                    <div className="hero-headline">
                        <div className="hand-hand-icon">
                            <span>New</span>
                            <img src={hand_icon} alt="Hand wave" className="wave-icon" />
                        </div>
                        <h1 className="hero-title">Collections</h1>
                        <h2 className="hero-subtitle">For Everyone</h2>
                    </div>

                    <p className="hero-description">
                        Curated apparel designed with supreme craftsmanship, luxurious fabrics, and effortless silhouettes that stand out everywhere you go.
                    </p>

                    <div className="hero-actions">
                        <button className="hero-latest-btn" onClick={scrollToCollections}>
                            <span>Explore Collection</span>
                            <img src={arrow_icon} alt="Arrow" className="btn-arrow" />
                        </button>

                        <div className="hero-trust">
                            <div className="trust-stars">★★★★★</div>
                            <span className="trust-text">Over 25,000+ happy customers</span>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="hero-image-wrapper">
                        <div className="hero-image-backdrop"></div>
                        <img src={heroImage} alt="Featured Fashion" className="hero-main-img" />

                        {/* Chic floating badge */}
                        <div className="floating-badge badge-top">
                            <span className="badge-icon">🔥</span>
                            <div>
                                <p className="badge-title">Trending Styles</p>
                                <p className="badge-subtitle">Up to 40% Off</p>
                            </div>
                        </div>

                        <div className="floating-badge badge-bottom">
                            <span className="badge-icon">✨</span>
                            <div>
                                <p className="badge-title">100% Cotton</p>
                                <p className="badge-subtitle">Breathable Quality</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
