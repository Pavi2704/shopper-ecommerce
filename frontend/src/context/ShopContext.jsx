
import React, {
    createContext,
    useState,
    useEffect,
    useCallback
} from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
    const backendUrl = "http://localhost:4000";

    const [all_product, setAll_Product] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productError, setProductError] = useState("");

    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("cartItems")) || {};
        } catch {
            return {};
        }
    });

    // Fetch products ONLY from the backend
    const fetchLiveProducts = useCallback(async () => {
        setLoading(true);
        setProductError("");

        try {
            const res = await fetch(`${backendUrl}/allproducts`);

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid product data received from backend");
            }

            const normalized = data.map((item) => {
                let img = item.image || "";

                if (img.startsWith("/src/assets/")) {
                    img = `${backendUrl}/images/${img.split("/").pop()}`;
                }

                return {
                    ...item,
                    image: img,
                    id: Number(item.id),
                    new_price: Number(item.new_price) || 0,
                    old_price: Number(item.old_price) || 0
                };
            });

            setAll_Product(normalized);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setAll_Product([]);
            setProductError(err.message || "Unable to load products");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLiveProducts();

        if (localStorage.getItem("auth-token")) {
            fetch(`${backendUrl}/getcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token")
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data && typeof data === "object" && !data.message) {
                        setCartItems(data);
                    }
                })
                .catch((err) => console.error("Error loading user cart:", err));
        }
    }, [fetchLiveProducts]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem("cartItems");
    };

    const logout = () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("cartItems");
        setCartItems({});
        window.location.href = "/";
    };

    const addToCart = (itemId, size = "") => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (Number(prev[itemId]) || 0) + 1
        }));
        if (localStorage.getItem("auth-token")) {
            fetch(`${backendUrl}/addtocart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token")
                },
                body: JSON.stringify({ itemId: itemId, size: size }),
            })
                .then((response) => response.json())
                .then((data) => console.log("Added to cart response:", data))
                .catch((err) => console.error("Error adding to cart:", err));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max(0, (Number(prev[itemId]) || 0) - 1)
        }));
        if (localStorage.getItem("auth-token")) {
            fetch(`${backendUrl}/removefromcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token")
                },
                body: JSON.stringify({ itemId: itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log("Removed from cart response:", data))
                .catch((err) => console.error("Error removing from cart:", err));
        }
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [id, quantity]) => {
            const product = all_product.find(
                (item) => item.id === Number(id)
            );

            return total + (
                product ? product.new_price * (Number(quantity) || 0) : 0
            );
        }, 0);
    };

    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce(
            (total, quantity) => total + (Number(quantity) || 0),
            0
        );
    };

    const contextValue = {
        all_product,
        cartItems,
        loading,
        productError,
        addToCart,
        removeFromCart,
        clearCart,
        logout,
        getTotalCartAmount,
        getTotalCartItems,
        refreshProducts: fetchLiveProducts
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;

