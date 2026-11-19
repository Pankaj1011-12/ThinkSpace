import express from 'express';
import { 
    addProduct, 
    editProduct, 
    getAllProduct, 
    getExploreBooks, 
    getSingleProduct, 
    removeProduct 
} from '../controller/product.js';
import userAuthentication from '../middleware/userAuthentication.js';
import uploadFile from '../middleware/uploadFile.js';

const product = express.Router();

// EXPLORE / PUBLIC MARKETPLACE
product.get("/explore", getExploreBooks);

// USER PRODUCTS & DETAILS
product.get("/", userAuthentication, getAllProduct);
product.get("/:productId", getSingleProduct);

// CREATE, EDIT, DELETE
product.post("/", userAuthentication, uploadFile.single("productimage"), addProduct);
product.patch("/:productId", userAuthentication, uploadFile.single("productimage"), editProduct);
product.delete("/:productId", userAuthentication, removeProduct);

export default product;