const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dns = require("dns");
const { type } = require("os");

// Use public DNS to prevent ECONNREFUSED on MongoDB SRV queries in Windows
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom_shopper_key";

app.use(express.json());
app.use(cors());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "upload", "images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Static image serving
app.use("/images", express.static(uploadDir));

// Base route
app.get("/", (req, res) => {
    res.send("Shopper E-Commerce API is running smoothly!");
});

// Image Upload Endpoint
app.post("/upload", upload.single("product"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: 0,
            message: "Please select an image file"
        });
    }

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// ================= SCHEMAS & MODELS =================

// 1. Product Schema
const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        new_price: {
            type: Number,
            required: true
        },
        old_price: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        available: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
            default: ""
        }
    })
);

// 2. User Schema
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        cartData: {
            type: Object,
            default: {}
        },
        role: {
            type: String,
            default: "customer"
        },
        date: {
            type: Date,
            default: Date.now
        }
    })
);

// 3. Order Schema
const Order = mongoose.model(
    "Order",
    new mongoose.Schema({
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: String,
            default: "guest"
        },
        customerName: {
            type: String,
            required: true
        },
        customerEmail: {
            type: String,
            required: true
        },
        customerPhone: {
            type: String,
            default: ""
        },
        address: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            zipCode: { type: String, default: "" },
            country: { type: String, default: "United States" }
        },
        items: [
            {
                id: { type: Number, required: true },
                name: { type: String, required: true },
                image: { type: String, default: "" },
                category: { type: String, default: "" },
                new_price: { type: Number, required: true },
                quantity: { type: Number, default: 1 }
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Order Placed"
        },
        paymentMethod: {
            type: String,
            default: "Cash on Delivery"
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    })
);

// ================= PRODUCT ENDPOINTS =================

// Add Product
app.post("/addproduct", async (req, res) => {
    try {
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const id = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: Number(req.body.new_price),
            old_price: Number(req.body.old_price),
            description: req.body.description || "",
            available: req.body.available !== undefined ? req.body.available : true
        });

        await product.save();
        console.log(`Product "${product.name}" added successfully with ID ${id}`);
        res.json({
            success: true,
            name: product.name,
            id: product.id,
            product: product
        });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update Product
app.post("/updateproduct", async (req, res) => {
    try {
        const { id, name, category, new_price, old_price, description, image, available } = req.body;
        const updated = await Product.findOneAndUpdate(
            { id: Number(id) },
            {
                name,
                category,
                new_price: Number(new_price),
                old_price: Number(old_price),
                description: description || "",
                image,
                available: available !== undefined ? available : true
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log(`Product ID ${id} updated successfully`);
        res.json({
            success: true,
            product: updated
        });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Toggle Product Availability
app.post("/toggleavailability", async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findOne({ id: Number(id) });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        product.available = !product.available;
        await product.save();
        res.json({ success: true, available: product.available });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Remove Product
app.post("/removeproduct", async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({ id: Number(req.body.id) });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        console.log(`Product ID ${req.body.id} removed successfully`);
        res.json({
            success: true,
            name: deleted.name,
            id: deleted.id
        });
    } catch (err) {
        console.error("Error removing product:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get All Products
app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.find({}).sort({ id: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get Single Product by ID
app.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ id: Number(req.params.id) });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ================= ORDER ENDPOINTS =================

// Get All Orders
app.get("/allorders", async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Place / Create Order
app.post("/placeorder", async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${orderCount + 1}`;

        const newOrder = new Order({
            orderId: orderId,
            userId: req.body.userId || "guest",
            customerName: req.body.customerName || "Customer",
            customerEmail: req.body.customerEmail || "customer@example.com",
            customerPhone: req.body.customerPhone || "",
            address: req.body.address || {},
            items: req.body.items || [],
            amount: Number(req.body.amount || 0),
            status: req.body.status || "Order Placed",
            paymentMethod: req.body.paymentMethod || "Cash on Delivery",
            isPaid: req.body.isPaid || false
        });

        await newOrder.save();
        res.json({ success: true, order: newOrder });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update Order Status
app.post("/updateorderstatus", async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const validStatuses = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const order = await Order.findOneAndUpdate(
            { orderId: orderId },
            { status: status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Remove Order
app.post("/removeorder", async (req, res) => {
    try {
        const { orderId } = req.body;
        const deleted = await Order.findOneAndDelete({ orderId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ================= USER & CUSTOMER ENDPOINTS =================

// Register User
app.post("/signup", async (req, res) => {
    try {
        let check = await User.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with this email" });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cartData: cart
        });

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Login User
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, errors: "Wrong email address" });
        }

        const passCompare = req.body.password === user.password;
        if (!passCompare) {
            return res.status(400).json({ success: false, errors: "Incorrect password" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get All Users (for Admin Customer list)
app.get("/allusers", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).sort({ date: -1 });

        // Calculate order counts for each user
        const usersWithStats = await Promise.all(
            users.map(async (u) => {
                const userOrdersCount = await Order.countDocuments({
                    $or: [{ userId: u._id.toString() }, { customerEmail: u.email }]
                });
                return {
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    date: u.date,
                    orderCount: userOrdersCount
                };
            })
        );

        res.json(usersWithStats);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Remove User
app.post("/removeuser", async (req, res) => {
    try {
        const { id } = req.body;
        await User.findByIdAndDelete(id);
        res.json({ success: true, message: "User removed successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ================= DASHBOARD ANALYTICS ENDPOINT =================

app.get("/admin/stats", async (req, res) => {
    try {
        const [totalProducts, totalOrders, totalUsers, products, orders] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments(),
            Product.find({}),
            Order.find({})
        ]);

        // Calculate Revenue from non-cancelled orders
        const validOrders = orders.filter((o) => o.status !== "Cancelled");
        const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        // Category breakdown
        const categoryCounts = {
            women: products.filter((p) => p.category?.toLowerCase() === "women").length,
            men: products.filter((p) => p.category?.toLowerCase() === "men").length,
            kids: products.filter((p) => p.category?.toLowerCase() === "kids").length
        };

        // Status counts
        const orderStatusCounts = {
            placed: orders.filter((o) => o.status === "Order Placed").length,
            processing: orders.filter((o) => o.status === "Processing").length,
            shipped: orders.filter((o) => o.status === "Shipped").length,
            delivered: orders.filter((o) => o.status === "Delivered").length,
            cancelled: orders.filter((o) => o.status === "Cancelled").length
        };

        const recentOrders = await Order.find({}).sort({ date: -1 }).limit(5);
        const recentProducts = await Product.find({}).sort({ id: -1 }).limit(5);

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalUsers,
                categoryCounts,
                orderStatusCounts,
                recentOrders,
                recentProducts
            }
        });
    } catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ success: false, message: "Please provide token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ success: false, message: "Invalid token" });
    }
};

// ================= FRONTEND STORE HELPER ENDPOINTS =================

// New Collections endpoint
app.get("/newcollections", async (req, res) => {
    try {
        const products = await Product.find({ available: true }).sort({ id: -1 }).limit(8);
        res.json(products);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Popular in Women endpoint
app.get("/popularinwomen", async (req, res) => {
    try {
        const products = await Product.find({ category: "women", available: true }).limit(4);
        res.json(products);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Cart endpoints
app.post("/addtocart", fetchUser, async (req, res) => {
    try {
        const itemId = req.body.itemId;
        if (itemId === undefined || itemId === null) {
            return res.status(400).json({ success: false, message: "itemId is required" });
        }
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!userData.cartData) userData.cartData = {};
        userData.cartData[itemId] = (Number(userData.cartData[itemId]) || 0) + 1;
        await User.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
        res.json({ success: true, message: "Added to cart", cartData: userData.cartData });
    } catch (err) {
        console.error("Error in /addtocart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/removefromcart", fetchUser, async (req, res) => {
    try {
        const itemId = req.body.itemId;
        if (itemId === undefined || itemId === null) {
            return res.status(400).json({ success: false, message: "itemId is required" });
        }
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!userData.cartData) userData.cartData = {};
        if (userData.cartData[itemId] && Number(userData.cartData[itemId]) > 0) {
            userData.cartData[itemId] = Number(userData.cartData[itemId]) - 1;
            await User.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
        }
        res.json({ success: true, message: "Removed from cart", cartData: userData.cartData });
    } catch (err) {
        console.error("Error in /removefromcart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/getcart", fetchUser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json(userData.cartData || {});
    } catch (err) {
        console.error("Error in /getcart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});


// ================= SEED INITIAL DATA (Orders & Customers) =================

async function seedInitialData() {
    try {
        const existingUsers = await User.countDocuments();
        if (existingUsers === 0) {
            await User.create([
                {
                    name: "Alex Morgan",
                    email: "alex.morgan@example.com",
                    password: "password123",
                    role: "customer"
                },
                {
                    name: "Sophia Chen",
                    email: "sophia.chen@example.com",
                    password: "password123",
                    role: "customer"
                },
                {
                    name: "David Miller",
                    email: "david.miller@example.com",
                    password: "password123",
                    role: "customer"
                }
            ]);
            console.log("Seeded initial demo customers.");
        }

        const existingOrders = await Order.countDocuments();
        if (existingOrders === 0) {
            const products = await Product.find({}).limit(4);
            const sampleItems = products.map((p) => ({
                id: p.id,
                name: p.name,
                image: p.image,
                category: p.category,
                new_price: p.new_price,
                quantity: 1
            }));

            if (sampleItems.length > 0) {
                await Order.create([
                    {
                        orderId: "ORD-9201-01",
                        customerName: "Alex Morgan",
                        customerEmail: "alex.morgan@example.com",
                        customerPhone: "+1 (555) 234-5678",
                        address: {
                            street: "742 Evergreen Terrace",
                            city: "Springfield",
                            state: "OR",
                            zipCode: "97477",
                            country: "USA"
                        },
                        items: [sampleItems[0]],
                        amount: sampleItems[0].new_price + 15,
                        status: "Processing",
                        paymentMethod: "Credit Card",
                        isPaid: true,
                        date: new Date(Date.now() - 3600000 * 5)
                    },
                    {
                        orderId: "ORD-9202-02",
                        customerName: "Sophia Chen",
                        customerEmail: "sophia.chen@example.com",
                        customerPhone: "+1 (555) 876-5432",
                        address: {
                            street: "1200 Market Street",
                            city: "San Francisco",
                            state: "CA",
                            zipCode: "94102",
                            country: "USA"
                        },
                        items: sampleItems.slice(0, 2),
                        amount: sampleItems.slice(0, 2).reduce((s, i) => s + i.new_price, 0) + 15,
                        status: "Delivered",
                        paymentMethod: "PayPal",
                        isPaid: true,
                        date: new Date(Date.now() - 86400000 * 2)
                    },
                    {
                        orderId: "ORD-9203-03",
                        customerName: "David Miller",
                        customerEmail: "david.miller@example.com",
                        customerPhone: "+1 (555) 432-1098",
                        address: {
                            street: "456 Elm Street",
                            city: "Austin",
                            state: "TX",
                            zipCode: "78701",
                            country: "USA"
                        },
                        items: [sampleItems[sampleItems.length - 1]],
                        amount: sampleItems[sampleItems.length - 1].new_price + 10,
                        status: "Order Placed",
                        paymentMethod: "Cash on Delivery",
                        isPaid: false,
                        date: new Date()
                    }
                ]);
                console.log("Seeded initial demo orders.");
            }
        }
    } catch (seedErr) {
        console.warn("Notice: Initial seed skipped or already present:", seedErr.message);
    }
}




// Database connection & Server start
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected successfully!");
        await seedInitialData();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });