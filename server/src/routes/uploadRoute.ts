import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import "../config/cloudConfig.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Temporary upload endpoint for destination images
router.post("/upload-temp", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "destinations",
          resource_type: "image",
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

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
