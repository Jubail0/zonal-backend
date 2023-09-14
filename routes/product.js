import express from "express";
const router = express.Router();
import { 
    createProduct, 
    getProducts,
    updateProduct, 
    deleteProduct,
    printOut,
    // multipleSize
} from "../controllers/product.js";

// Get,create,update,delete Each Sections products
router.route("/products/:id")
.get(getProducts)
.post(createProduct)
.put(updateProduct)
.delete(deleteProduct)

// router.route("/allmanyProducts").post(multipleSize)
router.route("/print/:sectionId").post(printOut)

export default router;