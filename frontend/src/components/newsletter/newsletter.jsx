import React, { useState } from "react";
import "./newsletter.css";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim() && email.includes("@")) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 5000);
        } else {
            alert("Please enter a valid email address");
        }
    };

    return (
        <section className="newsletter-wrapper">
            <div className="newsletter">
                <span className="newsletter-pill">JOIN THE SHOPPER CLUB</span>
                <h2 className="newsletter-title">Get Exclusive Offers & VIP Perks</h2>
                <p className="newsletter-subtitle">
                    Subscribe to our weekly edit and enjoy 10% off your first order plus early access to new releases.
                </p>

                {subscribed ? (
                    <div className="newsletter-success">
                        🎉 Thank you! Check your inbox for your 10% discount code.
                    </div>
                ) : (
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                )}

                <p className="newsletter-disclaimer">
                    🔒 We respect your privacy. No spam ever, unsubscribe anytime.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;
