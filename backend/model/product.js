const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the product name"],
        },
        description: {
            type: String,
            required: [true, "Please provide the product description"],
        },
        category: {
            type: String,
            required: [true, "Please provide the product category"],
        },
        tags: {
            type: [String],
            default: [],
        },
        price: {
            type: Number,
            required: [true, "Please provide the product price"],
        },
        stock: {
            type: Number,
            required: [true, "Please provide the product stock"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            match: [/.+@.+\..+/, "Please provide a valid email address"],
        },
        images: {
            type: [String],
            required: [true, "Please upload product images"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        cart: {
            type: [
                {
                    productid: {
                        type: String,
                        required: [true, "Please provide the product ID"],
                    },
                    quantity: {
                        type: Number,
                        required: [true, "Please provide the quantity"],
                        min: [0, "Quantity cannot be negative"],
                    },
                },
            ],
            validate: [arrayLimit, "Duplicate products not allowed in cart"],
        },
    },
    {
        timestamps: true,
    }
);

// Custom validator to prevent duplicate product IDs in the cart
function arrayLimit(val) {
    const productIds = val.map((item) => item.productid);
    return new Set(productIds).size === productIds.length;
}

module.exports = mongoose.model("Product", productSchema);
