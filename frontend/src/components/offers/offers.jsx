import React from "react";
import "./offers.css";
import exclusive_image from "../assets/exclusive_image.png";
import { Link } from "react-router-dom";

const Offers = () => {
    return (
        <section className="offers-wrapper">
            <div className="offers">
                <div className="offers-left">
                    <span className="offers-pill">EXCLUSIVE PROMOTION</span>
                    <h2 className="offers-heading">Exclusive Deals Curated Just For You</h2>
                    <p className="offers-subtext">
                        Discover seasonal favorites and luxury essentials at irresistible prices. Handcrafted to perfection.
                    </p>
                    <div className="offers-timer-row">
                        <div className="offers-stat">
                            <span className="stat-val">Up to 60%</span>
                            <span className="stat-lbl">Off Select Items</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="offers-stat">
                            <span className="stat-val">COD</span>
                            <span className="stat-lbl">Pay On Delivery</span>
                        </div>
                    </div>
                    <Link to="/women" onClick={() => window.scrollTo(0, 0)} className="offers-btn-link">
                        <button className="offers-btn">Shop Exclusive Deals →</button>
                    </Link>
                </div>

                <div className="offers-right">
                    <div className="offers-image-backdrop"></div>
                    <img src={exclusive_image} alt="Exclusive Promo" className="offers-img" />
                </div>
            </div>
        </section>
    );
};

export default Offers;
