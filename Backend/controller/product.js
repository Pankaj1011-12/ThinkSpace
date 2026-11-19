import mongoose from "mongoose";
import path from 'path';
import fs from 'fs';
import ProductModel from "../models/productSchema.js";

const removeUploadedFile = (filename) => {
    if (!filename) return;
    const uploadDir = process.env.UPLOAD_DIRECTORY || "uploads";
    const filePath = path.join(uploadDir, "productimage", filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error removing uploaded file:", err);
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const { title, price, description, bookAuthor, condition, category, contactInfo } = req.body;
        const image = req.file ? req.file.filename : null;
        const authorId = req.user._id.toString();

        if (!title || !price || !description) {
            if (image) removeUploadedFile(image);
            return res.status(400).json({ status: false, message: 'Title, price, and description are required.' });
        }

        if (!image) {
            return res.status(400).json({ status: false, message: 'Book cover image is required.' });
        }

        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice < 0) {
            removeUploadedFile(image);
            return res.status(400).json({ status: false, message: 'Price must be a valid number (0 or greater).' });
        }

        const validConditions = ["New", "Like New", "Good", "Acceptable"];
        const bookCondition = validConditions.includes(condition) ? condition : "Good";

        const newProduct = new ProductModel({
            title: title.trim(),
            bookAuthor: (bookAuthor || "").trim(),
            price: numPrice,
            condition: bookCondition,
            category: (category || "General").trim(),
            description: description.trim(),
            contactInfo: (contactInfo || "").trim(),
            image,
            authorId,
            createdAt: new Date()
        });

        const savedProduct = await newProduct.save();
        return res.status(201).json({ status: true, message: "Book listing created successfully", product: savedProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        if (req.file) removeUploadedFile(req.file.filename);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const removeProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const authorId = req.user._id.toString();

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ status: false, message: "Invalid product ID" });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "Book listing not found" });
        }

        if (product.authorId.toString() !== authorId && req.user.role !== "admin") {
            return res.status(403).json({ status: false, message: "You are not authorized to delete this listing" });
        }

        if (product.image) {
            removeUploadedFile(product.image);
        }

        await ProductModel.findByIdAndDelete(productId);
        return res.status(200).json({ status: true, message: "Book listing deleted successfully" });
    } catch (error) {
        console.error("Error removing product:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const editProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const authorId = req.user._id.toString();
        const { title, price, description, bookAuthor, condition, category, contactInfo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            if (req.file) removeUploadedFile(req.file.filename);
            return res.status(400).json({ status: false, message: "Invalid product ID" });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            if (req.file) removeUploadedFile(req.file.filename);
            return res.status(404).json({ status: false, message: "Book listing not found" });
        }

        if (product.authorId.toString() !== authorId && req.user.role !== "admin") {
            if (req.file) removeUploadedFile(req.file.filename);
            return res.status(403).json({ status: false, message: "You are not authorized to edit this listing" });
        }

        if (title !== undefined) product.title = title.trim();
        if (bookAuthor !== undefined) product.bookAuthor = bookAuthor.trim();
        if (description !== undefined) product.description = description.trim();
        if (category !== undefined) product.category = category.trim();
        if (contactInfo !== undefined) product.contactInfo = contactInfo.trim();

        if (condition !== undefined) {
            const validConditions = ["New", "Like New", "Good", "Acceptable"];
            if (validConditions.includes(condition)) product.condition = condition;
        }

        if (price !== undefined) {
            const numPrice = Number(price);
            if (isNaN(numPrice) || numPrice < 0) {
                if (req.file) removeUploadedFile(req.file.filename);
                return res.status(400).json({ status: false, message: "Invalid price value" });
            }
            product.price = numPrice;
        }

        if (req.file) {
            // Delete old image
            if (product.image) removeUploadedFile(product.image);
            product.image = req.file.filename;
        }

        const updatedProduct = await product.save();
        return res.status(200).json({ status: true, message: "Book listing updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error editing product:", error);
        if (req.file) removeUploadedFile(req.file.filename);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// Returns user's own products (for "My Products")
const getAllProduct = async (req, res) => {
    try {
        const { limit, sort } = req.query;
        const authorId = req.user._id.toString();

        let productsQuery = ProductModel.find({ authorId });

        if (sort === 'createdAt' || !sort) {
            productsQuery = productsQuery.sort({ createdAt: -1 });
        }

        if (limit) {
            productsQuery = productsQuery.limit(parseInt(limit));
        }

        const products = await productsQuery;
        return res.status(200).json({ status: true, products });
    } catch (error) {
        console.error("Error in getAllProduct:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// Public Book Marketplace (all books from all users)
const getExploreBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const search = req.query.search ? req.query.search.trim() : "";
        const condition = req.query.condition || "";
        const category = req.query.category || "";
        const sort = req.query.sort || "newest"; // "newest", "price-low", "price-high"

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { bookAuthor: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        if (condition && condition !== "all") {
            query.condition = condition;
        }

        if (category && category !== "all") {
            query.category = { $regex: `^${category}$`, $options: "i" };
        }

        let sortOption = { createdAt: -1 };
        if (sort === "price-low") sortOption = { price: 1 };
        if (sort === "price-high") sortOption = { price: -1 };

        const totalBooks = await ProductModel.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limit) || 1;
        const skip = (page - 1) * limit;

        const books = await ProductModel.find(query)
            .populate("authorId", "fullName email image _id")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        const formattedBooks = books.map(book => ({
            _id: book._id,
            title: book.title,
            bookAuthor: book.bookAuthor || "",
            image: book.image,
            price: book.price,
            condition: book.condition || "Good",
            category: book.category || "General",
            description: book.description,
            contactInfo: book.contactInfo || "",
            createdAt: book.createdAt,
            seller: book.authorId ? {
                _id: book.authorId._id,
                fullName: book.authorId.fullName,
                email: book.authorId.email,
                image: book.authorId.image
            } : { fullName: "ThinkSpace Seller" }
        }));

        return res.status(200).json({
            status: true,
            books: formattedBooks,
            totalBooks,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error("Error in getExploreBooks:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ status: false, message: "Invalid product ID" });
        }

        const product = await ProductModel.findById(productId)
            .populate("authorId", "fullName email image bio _id")
            .lean();

        if (!product) {
            return res.status(404).json({ status: false, message: "Book listing not found" });
        }

        const formattedProduct = {
            _id: product._id,
            title: product.title,
            bookAuthor: product.bookAuthor || "",
            image: product.image,
            price: product.price,
            condition: product.condition || "Good",
            category: product.category || "General",
            description: product.description,
            contactInfo: product.contactInfo || "",
            createdAt: product.createdAt,
            authorId: product.authorId ? product.authorId._id : null,
            authorName: product.authorId ? product.authorId.fullName : "Unknown",
            authorEmail: product.authorId ? product.authorId.email : "",
            authorImage: product.authorId ? product.authorId.image : null,
            authorBio: product.authorId ? product.authorId.bio : ""
        };

        return res.status(200).json({ status: true, message: "Data Fetched Successfully", product: formattedProduct });
    } catch (error) {
        console.error("Error fetching single product:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export { addProduct, removeProduct, editProduct, getAllProduct, getExploreBooks, getSingleProduct };