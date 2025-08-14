import { v2 as cloudinary } from "cloudinary";
import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import "../config/cloudConfig.js";
const storage = multer.memoryStorage();

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    const err = new Error(
      "Only JPEG, PNG, JPG, WebP images, and PDF files are allowed"
    ) as unknown as null;
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

function uploadToCloudinary(folderName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🔄 uploadToCloudinary middleware called");

      // Check Cloudinary configuration
      if (!cloudinary.config().cloud_name) {
        console.error("❌ Cloudinary not configured properly");
        return res.status(500).json({
          message: "File upload service not configured",
        });
      }

      console.log("File present:", !!req.file);
      console.log(
        "File details:",
        req.file
          ? {
              fieldname: req.file.fieldname,
              originalname: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
            }
          : "No file"
      );

      if (!req.file) {
        console.log("⏭️ No file to upload, continuing to next middleware");
        return next();
      }

      const fileExtension = path.extname(req.file.originalname).substring(1);
      const publicId = `${req.file.fieldname}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const isPDF = req.file.mimetype === "application/pdf";

      console.log("📤 Starting Cloudinary upload:", {
        folder: folderName.trim(),
        publicId,
        fileExtension,
        isPDF,
      });

      // Add timeout to the upload
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folderName.trim(),
            public_id: publicId,
            format: fileExtension,
            resource_type: isPDF ? "raw" : "image",
            access_control: [
              {
                access_type: "anonymous",
              },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload stream error:", error);
              reject(error);
            } else {
              console.log(
                "✅ Cloudinary upload successful:",
                result?.secure_url
              );
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file!.buffer);
      });

      // Add timeout to prevent hanging requests
      const timeout = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Upload timeout after 30 seconds")),
          30000
        );
      });

      const result = await Promise.race([uploadPromise, timeout]);

      (req as any).cloudinaryResult = result;
      console.log("✅ Cloudinary result attached to request");
      next();
    } catch (error) {
      console.error("❌ Cloudinary upload middleware error:", error);
      res.status(500).json({
        message: "File upload failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}

function uploadMiddleware(folderName: string) {
  return [upload.single("profileImage"), uploadToCloudinary(folderName)];
}

// Travel list cover image upload middleware
function travelListUploadMiddleware(folderName: string = "travel-lists") {
  return [upload.single("coverImage"), uploadToCloudinary(folderName)];
}

export default uploadMiddleware;
export { travelListUploadMiddleware };
