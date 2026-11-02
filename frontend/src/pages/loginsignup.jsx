import React, { useState } from "react";
import "./css/loginsignup.css";
import { Link } from "react-router-dom";

const LoginSignup = () => {
    const [state, setState] = useState("Login");
    const [agree, setAgree] = useState(false);
    const [agreeError, setAgreeError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setAgreeError("");
    };

    const handleSwitchState = (newState) => {
        setState(newState);
        setAgreeError("");
    };

    const login = async () => {
        if (!agree) {
            alert("Please check the agreement box: By continuing, I agree to the terms of use & privacy policy.");
            setAgreeError("Please agree to the terms of use & privacy policy to continue.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const responseData = await response.json();

            if (responseData.success) {
                localStorage.setItem("auth-token", responseData.token);
                const redirectTarget = sessionStorage.getItem("redirectAfterLogin") || "/";
                sessionStorage.removeItem("redirectAfterLogin");
                window.location.href = redirectTarget;
            } else {
                alert(responseData.errors || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Network error: Could not connect to the server.");
        }
    };

    const signup = async () => {
        if (!agree) {
            alert("Please check the agreement box: By continuing, I agree to the terms of use & privacy policy.");
            setAgreeError("Please agree to the terms of use & privacy policy to continue.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();

            if (responseData.success) {
                localStorage.setItem("auth-token", responseData.token);
                const redirectTarget = sessionStorage.getItem("redirectAfterLogin") || "/";
                sessionStorage.removeItem("redirectAfterLogin");
                window.location.href = redirectTarget;
            } else {
                alert(responseData.errors || "Sign up failed");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Network error: Could not connect to the server.");
        }
    };

    return (
        <div className="loginsignup-page">
            <div className="loginsignup-card">
                {/* State Switcher Tabs */}
                <div className="loginsignup-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${state === "Login" ? "active" : ""}`}
                        onClick={() => handleSwitchState("Login")}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${state === "Sign Up" ? "active" : ""}`}
                        onClick={() => handleSwitchState("Sign Up")}
                    >
                        Create Account
                    </button>
                </div>

                {sessionStorage.getItem("redirectAfterLogin") === "/cart" && (
                    <div className="login-checkout-alert">
                        🛍️ Please sign in or create an account to complete your checkout.
                    </div>
                )}

                <div className="loginsignup-header">
                    <h2>{state === "Login" ? "Welcome Back to Shopper" : "Create Your Shopper Account"}</h2>
                    <p>
                        {state === "Login"
                            ? "Sign in to access your saved bag, track orders, and discover new drops."
                            : "Join our exclusive club for seamless checkout, order tracking, and perks."}
                    </p>
                </div>

                <form
                    className="loginsignup-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        state === "Login" ? login() : signup();
                    }}
                >
                    <div className="loginsignup-fields">
                        {state === "Sign Up" && (
                            <div className="input-group">
                                <label>Your Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={changeHandler}
                                    type="text"
                                    placeholder="e.g. Maya Patel"
                                    required
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={changeHandler}
                                type="email"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                name="password"
                                value={formData.password}
                                onChange={changeHandler}
                                type="password"
                                placeholder="Enter secure password"
                                required
                            />
                        </div>
                    </div>

                    <div className="loginsignup-agree">
                        <input
                            type="checkbox"
                            id="agreeCheckbox"
                            checked={agree}
                            onChange={(e) => {
                                setAgree(e.target.checked);
                                if (e.target.checked) setAgreeError("");
                            }}
                        />
                        <label htmlFor="agreeCheckbox">
                            By continuing, I agree to the Shopper terms of use & privacy policy
                        </label>
                    </div>

                    {agreeError && (
                        <div className="loginsignup-agree-error">
                            ⚠️ {agreeError}
                        </div>
                    )}

                    <button type="submit" className="loginsignup-submit-btn">
                        {state === "Login" ? "Sign In to Account" : "Create My Account"}
                    </button>
                </form>

                <div className="loginsignup-footer">
                    {state === "Sign Up" ? (
                        <p>
                            Already have an account?{" "}
                            <span onClick={() => handleSwitchState("Login")}>Sign In here</span>
                        </p>
                    ) : (
                        <p>
                            New to Shopper?{" "}
                            <span onClick={() => handleSwitchState("Sign Up")}>Create an account</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
