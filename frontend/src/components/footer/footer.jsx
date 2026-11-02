import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

import footer_logo from "../assets/logo_big.png";
import instagram_icon from "../assets/instagram_icon.png";
import pintrest_icon from "../assets/pintester_icon.png";
import whatsapp_icon from "../assets/whatsapp_icon.png";

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            {/* Value Proposition Strip */}
            <div className="footer-perks">
                <div className="perk-item">
                    <span className="perk-icon">🚚</span>
                    <div>
                        <h4 className="perk-title">Free Express Shipping</h4>
                        <p className="perk-desc">On all orders nationwide</p>
                    </div>
                </div>

                <div className="perk-item">
                    <span className="perk-icon">💵</span>
                    <div>
                        <h4 className="perk-title">Cash On Delivery</h4>
                        <p className="perk-desc">Pay at your doorstep with ease</p>
                    </div>
                </div>

                <div className="perk-item">
                    <span className="perk-icon">🔄</span>
                    <div>
                        <h4 className="perk-title">30-Day Easy Returns</h4>
                        <p className="perk-desc">Hassle-free exchanges & returns</p>
                    </div>
                </div>

                <div className="perk-item">
                    <span className="perk-icon">✨</span>
                    <div>
                        <h4 className="perk-title">100% Certified Quality</h4>
                        <p className="perk-desc">Authentic premium materials</p>
                    </div>
                </div>
            </div>

            <div className="footer-main">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src={footer_logo} alt="Shopper Logo" />
                        <span className="footer-brand-name">SHOPPER</span>
                    </div>
                    <p className="footer-tagline">
                        Redefining modern style with premier fashion pieces that blend elegance, comfort, and distinction.
                    </p>
                </div>

                <div className="footer-links-group">
                    <h5 className="footer-heading">Collections</h5>
                    <ul className="footer-links">
                        <li><Link to="/women">Women's Fashion</Link></li>
                        <li><Link to="/men">Men's Apparel</Link></li>
                        <li><Link to="/kids">Kids Collection</Link></li>
                        <li><Link to="/">New Arrivals</Link></li>
                    </ul>
                </div>

                <div className="footer-links-group">
                    <h5 className="footer-heading">Customer Care</h5>
                    <ul className="footer-links">
                        <li><span>Track Order</span></li>
                        <li><span>Shipping & Delivery</span></li>
                        <li><span>Returns & Refunds</span></li>
                        <li><span>FAQs</span></li>
                    </ul>
                </div>

                <div className="footer-social-section">
                    <h5 className="footer-heading">Connect With Us</h5>
                    <p className="social-subtext">Follow our story and trend drops</p>
                    <div className="footer-social-icon">
                        <div className="footer-icons-container" title="Instagram">
                            <img src={instagram_icon} alt="Instagram" />
                        </div>
                        <div className="footer-icons-container" title="Pinterest">
                            <img src={pintrest_icon} alt="Pinterest" />
                        </div>
                        <div className="footer-icons-container" title="WhatsApp">
                            <img src={whatsapp_icon} alt="WhatsApp" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 SHOPPER Inc. All Rights Reserved. Designed for elegance.</p>
                <div className="footer-bottom-links">
                    <span>Privacy Policy</span>
                    <span>•</span>
                    <span>Terms of Service</span>
                    <span>•</span>
                    <span>Security</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
