const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        new_price: { type: Number, required: true },
        old_price: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        available: { type: Boolean, default: true },
        description: { type: String, default: "" }
    })
);

const sampleCatalog = [];

// Women: 1 - 12
for (let i = 1; i <= 12; i++) {
    sampleCatalog.push({
        id: i,
        name: `Striped Flutter Sleeve Peplum Hem Blouse #${i}`,
        category: "women",
        image: `http://0/images/product_${i}.png`,
        new_price: 50.0 + (i % 5) * 10,
        old_price: 80.0 + (i % 5) * 12,
        description: "Elegant and stylish women floral flutter sleeve top for all occasions.",
        available: true
    });
}

// Men: 13 - 24
for (let i = 13; i <= 24; i++) {
    sampleCatalog.push({
        id: i,
        name: `Men Slim Fit Urban Bomber Jacket #${i}`,
        category: "men",
        image: `https://shopper-backend-ne59.onrender.com/images/product_${i}.png`,
        new_price: 65.0 + (i % 4) * 15,
        old_price: 110.0 + (i % 4) * 15,
        description: "Modern street style men jacket with premium zipper and comfortable inner lining.",
        available: true
    });
}

// Kids: 25 - 36
for (let i = 25; i <= 36; i++) {
    sampleCatalog.push({
        id: i,
        name: `Boys Colourblocked Hooded Sweatshirt #${i}`,
        category: "kids",
        image: `https://shopper-backend-ne59.onrender.com/images/product_${i}.png`,
        new_price: 45.0 + (i % 3) * 10,
        old_price: 75.0 + (i % 3) * 12,
        description: "Cozy warm kids pullover hoodie made from pure organic cotton.",
        available: true
    });
}

async function runSeed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for product seeding...");

        let insertedCount = 0;
        for (const item of sampleCatalog) {
            const exists = await Product.findOne({ id: item.id });
            if (!exists) {
                await Product.create(item);
                insertedCount++;
            }
        }
        console.log(`Successfully seeded ${insertedCount} new products into catalog.`);

        // Fix image for product 26 if relative
        const p26 = await Product.findOne({ id: 26 });
        if (p26 && p26.image.startsWith("/")) {
            p26.image = "https://shopper-backend-ne59.onrender.com/images/product_13.png";
            await p26.save();
            console.log("Updated product 26 image URL to full backend URL");
        }

        const total = await Product.countDocuments();
        console.log(`Total products currently in database: ${total}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
}

runSeed();
