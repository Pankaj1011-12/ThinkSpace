import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = process.env.UPLOAD_DIRECTORY || "uploads";
        const targetDir = path.join(uploadDir, file.fieldname || "general");
        
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        cb(null, targetDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (JPEG, PNG, WebP, GIF) are allowed!"), false);
    }
};

const uploadFile = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter
});

export default uploadFile;