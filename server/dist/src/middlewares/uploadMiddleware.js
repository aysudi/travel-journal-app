import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import "../config/cloudConfig.js";
const storage = multer.memoryStorage();
const fileFilter = (_, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/avif",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
        const err = new Error("Only JPEG, PNG, JPG, WebP images, and PDF files are allowed");
        return cb(err, false);
    }
    cb(null, true);
};
const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
    fileFilter,
});
function uploadToCloudinary(folderName) {
    return async (req, res, next) => {
        try {
            if (!cloudinary.config().cloud_name) {
                console.error("❌ Cloudinary not configured properly");
                return res.status(500).json({
                    message: "File upload service not configured",
                });
            }
            if (!req.file) {
                return next();
            }
            const fileExtension = path.extname(req.file.originalname).substring(1);
            const publicId = `${req.file.fieldname}-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;
            const isPDF = req.file.mimetype === "application/pdf";
            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: folderName.trim(),
                    public_id: publicId,
                    format: fileExtension,
                    resource_type: isPDF ? "raw" : "image",
                    access_control: [
                        {
                            access_type: "anonymous",
                        },
                    ],
                }, (error, result) => {
                    if (error) {
                        console.error("❌ Cloudinary upload stream error:", error);
                        reject(error);
                    }
                    else {
                        console.log("✅ Cloudinary upload successful:", result?.secure_url);
                        resolve(result);
                    }
                });
                uploadStream.end(req.file.buffer);
            });
            const timeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Upload timeout after 30 seconds")), 30000);
            });
            const result = await Promise.race([uploadPromise, timeout]);
            req.cloudinaryResult = result;
            next();
        }
        catch (error) {
            console.error("❌ Cloudinary upload middleware error:", error);
            res.status(500).json({
                message: "File upload failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };
}
function uploadMiddleware(folderName, fieldName = "profileImage") {
    return [upload.single(fieldName), uploadToCloudinary(folderName)];
}
function travelListUploadMiddleware(folderName = "travel-lists") {
    return [upload.single("coverImage"), uploadToCloudinary(folderName)];
}
function chatUploadMiddleware(folderName = "chat-avatars") {
    return [upload.single("avatar"), uploadToCloudinary(folderName)];
}
export default uploadMiddleware;
export { travelListUploadMiddleware, chatUploadMiddleware };
