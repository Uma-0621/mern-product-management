const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductStock,
    updateProductStatus
} = require("../controllers/productController");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, safeName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, WEBP and GIF images are allowed"));
        }

        cb(null, true);
    }
});

router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateProductStock);
router.patch("/:id/status", updateProductStatus);

module.exports = router;
