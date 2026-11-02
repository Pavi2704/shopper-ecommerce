import React, { useState, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import { ShopContext } from "../../context/ShopContext";

import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";
import nav_dropdown from "../assets/nav_dropdown.png";

const Navbar = () => {
    const location = useLocation();
    const { getTotalCartItems, logout } = useContext(ShopContext);
    const menuRef = useRef();

    // Determine active menu based on pathname
    const getActiveMenu = () => {
        const path = location.pathname;
        if (path === "/men") return "men";
        if (path === "/women") return "women";
        if (path === "/kids") return "kids";
        if (path === "/") return "shop";
        return "";
    };

    const currentMenu = getActiveMenu();

    const dropdown_toggle = (e) => {
        if (menuRef.current) {
            menuRef.current.classList.toggle("nav-menu-visible");
        }
        e.currentTarget.classList.toggle("open");
    };

    const closeMenu = () => {
        if (menuRef.current) {
            menuRef.current.classList.remove("nav-menu-visible");
        }
        const dropdown = document.querySelector(".nav-dropdown");
        if (dropdown) {
            dropdown.classList.remove("open");
        }
    };

    return (
        <header className="navbar-wrapper">
            {/* Top Micro-Bar */}
            <div className="navbar-topbar">
                <p>✨ Free Shipping Across India • Cash On Delivery Available • 100% Original Products</p>
            </div>

            <nav className="navbar">
                <div className="nav-logo">
                    <Link to="/" onClick={closeMenu} className="nav-logo-link">
                        <img src={logo} alt="Shopper Logo" className="logo-img" />
                        <span className="logo-text">SHOPPER</span>
                    </Link>
                </div>

                <img
                    className="nav-dropdown"
                    src={nav_dropdown}
                    onClick={dropdown_toggle}
                    alt="Toggle Menu"
                />

                <ul ref={menuRef} className="nav-menu">
                    <li>
                        <Link
                            to="/"
                            className={`nav-link ${currentMenu === "shop" ? "active" : ""}`}
                            onClick={closeMenu}
                        >
                            Shop
                            {currentMenu === "shop" && <span className="active-dot" />}
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/men"
                            className={`nav-link ${currentMenu === "men" ? "active" : ""}`}
                            onClick={closeMenu}
                        >
                            Men
                            {currentMenu === "men" && <span className="active-dot" />}
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/women"
                            className={`nav-link ${currentMenu === "women" ? "active" : ""}`}
                            onClick={closeMenu}
                        >
                            Women
                            {currentMenu === "women" && <span className="active-dot" />}
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/kids"
                            className={`nav-link ${currentMenu === "kids" ? "active" : ""}`}
                            onClick={closeMenu}
                        >
                            Kids
                            {currentMenu === "kids" && <span className="active-dot" />}
                        </Link>
                    </li>
                </ul>

                <div className="nav-login-cart">
                    {localStorage.getItem("auth-token") ? (
                        <button onClick={logout} className="nav-auth-btn logout-btn">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" onClick={closeMenu}>
                            <button className="nav-auth-btn login-btn">
                                Sign In
                            </button>
                        </Link>
                    )}

                    <Link to="/cart" className="cart-icon-container" onClick={closeMenu} aria-label="View Shopping Cart">
                        <div className="cart-icon-circle">
                            <img src={cart_icon} alt="Cart" />
                            {getTotalCartItems() > 0 && (
                                <span className="nav-cart-count">{getTotalCartItems()}</span>
                            )}
                        </div>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
