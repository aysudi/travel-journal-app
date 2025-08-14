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
      if (!req.file) {
        return next();
      }

      const fileExtension = path.extname(req.file.originalname).substring(1);
      const publicId = `${req.file.fieldname}-${Date.now()}`;
      const isPDF = req.file.mimetype === "application/pdf";

      const result = await new Promise((resolve, reject) => {
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
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file!.buffer);
      });

      (req as any).cloudinaryResult = result;
      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
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
