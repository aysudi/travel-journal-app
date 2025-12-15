import { Request, Response } from "express";
import * as journalEntryService from "../services/journalEntryService.js";
import JournalEntryModel from "../models/JournalEntry.js";
import {
  journalEntryCreateSchema,
  journalEntryUpdateSchema,
  objectIdSchema,
} from "../validations/journalEntry.validation.js";
import formatMongoData from "../utils/formatMongoData.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as premiumLimitService from "../services/premiumLimitService.js";

const upload = multer({ storage: multer.memoryStorage() });

// Create a new journal entry
export const createJournalEntry = [
  upload.array("photos", 5),
  async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Transform FormData string values to proper types
      const transformedBody = {
        ...req.body,
        public:
          req.body.public === "true"
            ? true
            : req.body.public === "false"
            ? false
            : req.body.public,
        author: req.body.author || userId,
      };

      // Check journal entry limit
      const journalLimitCheck = await premiumLimitService.canCreateJournalEntry(
        userId
      );
      if (!journalLimitCheck.canCreate) {
        return res.status(403).json({
          success: false,
          message: "Journal entry limit reached",
          data: {
            currentCount: journalLimitCheck.currentCount,
            limit: journalLimitCheck.limit,
            needsPremium: true,
          },
        });
      }

      // Check image limit
      const imageCount = req.files
        ? (req.files as Express.Multer.File[]).length
        : 0;
      const imageLimitCheck = await premiumLimitService.canAddImageToJournal(
        userId,
        imageCount
      );
      if (!imageLimitCheck.canAdd && imageCount > 0) {
        return res.status(403).json({
          success: false,
          message: `You can only add ${imageLimitCheck.limit} image(s) per journal entry`,
          data: {
            currentCount: imageCount,
            limit: imageLimitCheck.limit,
            needsPremium: true,
          },
        });
      }

      const { error, value } =
        journalEntryCreateSchema.validate(transformedBody);
      if (error) {
        console.log("Validation error details:", error.details);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      // Handle image uploads to Cloudinary
      let photoUrls: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          try {
            await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "journal-entries" },
                (error, result) => {
                  if (error) reject(error);
                  else {
                    if (result?.secure_url) photoUrls.push(result.secure_url);
                    resolve(result);
                  }
                }
              );
              stream.end(file.buffer);
            });
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
          }
        }
      }

      const journalEntryData = {
        ...value,
        photos: photoUrls,
      };

      const journalEntry = await journalEntryService.createJournalEntry(
        journalEntryData,
        userId
      );

      res.status(201).json({
        success: true,
        message: "Journal entry created successfully",
        data: formatMongoData(journalEntry),
      });
    } catch (error: any) {
      console.error("Create journal entry error:", error);

      if (error.message.includes("Destination not found")) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("permission")) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create journal entry",
        error: error.message,
      });
    }
  },
];

// Get journal entry by ID
export const getJournalEntryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = objectIdSchema.validate(id);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid journal entry ID",
      });
    }

    const journalEntry = await journalEntryService.getJournalEntryById(id);

    res.status(200).json({
      success: true,
      message: "Journal entry retrieved successfully",
      data: formatMongoData(journalEntry),
    });
  } catch (error: any) {
    console.error("Get journal entry error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve journal entry",
      error: error.message,
    });
  }
};

// Update journal entry
export const updateJournalEntry = [
  upload.array("photos", 5),
  async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { error: idError } = objectIdSchema.validate(id);
      if (idError) {
        return res.status(400).json({
          success: false,
          message: "Invalid journal entry ID",
        });
      }

      const { error, value } = journalEntryUpdateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      // Get existing entry to handle old images
      const existingEntry = await JournalEntryModel.findById(id);
      if (!existingEntry) {
        return res.status(404).json({
          success: false,
          message: "Journal entry not found",
        });
      }

      // Handle image updates
      let photoUrls: string[] = [];

      // If new images are uploaded, delete old ones and upload new ones
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Delete old images from Cloudinary
        if (existingEntry.photos && existingEntry.photos.length > 0) {
          for (const photoUrl of existingEntry.photos) {
            try {
              const parts = photoUrl.split("/");
              const folder = parts[parts.length - 2];
              const filename = parts[parts.length - 1].split(".")[0];
              const publicId = `${folder}/${filename}`;
              await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
              console.error("Failed to delete old image:", deleteError);
            }
          }
        }

        // Upload new images
        for (const file of req.files as Express.Multer.File[]) {
          try {
            await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "journal-entries" },
                (error, result) => {
                  if (error) reject(error);
                  else {
                    if (result?.secure_url) photoUrls.push(result.secure_url);
                    resolve(result);
                  }
                }
              );
              stream.end(file.buffer);
            });
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
          }
        }
      } else {
        // Keep existing images if no new images uploaded
        photoUrls = existingEntry.photos || [];
      }

      // Add photos to update data
      const updateData = {
        ...value,
        photos: photoUrls,
      };

      const updatedEntry = await journalEntryService.updateJournalEntry(
        id,
        updateData,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Journal entry updated successfully",
        data: formatMongoData(updatedEntry),
      });
    } catch (error: any) {
      console.error("Update journal entry error:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("permission")) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update journal entry",
        error: error.message,
      });
    }
  },
];

// Delete journal entry
export const deleteJournalEntry = async (req: Request, res: Response) => {
  try {
    const { error } = objectIdSchema.validate(req.params.id);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const userId = (req.user as any)?.id;

    const existingEntry = await JournalEntryModel.findById(id);
    if (!existingEntry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    if (existingEntry.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own journal entries" });
    }

    // Delete images from Cloudinary
    if (existingEntry.photos && existingEntry.photos.length > 0) {
      for (const photoUrl of existingEntry.photos) {
        try {
          const parts = photoUrl.split("/");
          const folder = parts[parts.length - 2]; // journal-entries
          const filename = parts[parts.length - 1].split(".")[0];
          const publicId = `${folder}/${filename}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.error("Failed to delete image from Cloudinary:", deleteError);
          // Continue with journal deletion even if image deletion fails
        }
      }
    }

    const deletedEntry = await journalEntryService.deleteJournalEntry(
      id,
      userId
    );
    res.json({ message: "Journal entry deleted successfully", deletedEntry });
  } catch (err) {
    console.error("Error deleting journal entry:", err);
    res.status(500).json({ error: "Failed to delete journal entry" });
  }
};

export const toggleJournalEntryLike = async (req: Request, res: Response) => {
  try {
    const { error } = objectIdSchema.validate(req.params.id);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!id || !userId) {
      return res
        .status(400)
        .json({ error: "Journal entry ID and user ID are required" });
    }

    const journalEntry = await journalEntryService.getJournalEntryById(id);
    if (!journalEntry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    const userLiked = journalEntry.likes.includes(userId);
    let updatedEntry;

    if (userLiked) {
      updatedEntry = await journalEntryService.unlikeJournalEntry(id, userId);
    } else {
      updatedEntry = await journalEntryService.likeJournalEntry(id, userId);
    }

    res.json({
      message: `Journal entry ${userLiked ? "unliked" : "liked"} successfully`,
      journalEntry: updatedEntry,
    });
  } catch (err) {
    console.error("Error toggling journal entry like:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

// Get journal entries with filtering, pagination, and search
export const getJournalEntries = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      destination,
      author,
      travelListId,
      public: isPublic,
      search,
      sort,
      order,
    } = req.query;

    if (travelListId) {
      const { error } = objectIdSchema.validate(travelListId);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid travel list ID",
        });
      }

      const userId = (req.user as any)?.id;
      const queryParams = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        author: author as string,
        public:
          isPublic === "true" ? true : isPublic === "false" ? false : undefined,
        search: search as string,
        sort: sort as string,
        order: (order as "asc" | "desc") || "desc",
        userId,
      };

      if (queryParams.author) {
        const { error: authorError } = objectIdSchema.validate(
          queryParams.author
        );
        if (authorError) {
          return res.status(400).json({
            success: false,
            message: "Invalid author ID",
          });
        }
      }

      const result = await journalEntryService.getJournalEntriesByTravelList(
        travelListId as string,
        queryParams
      );

      return res.status(200).json({
        success: true,
        message: "Journal entries retrieved successfully",
        data: formatMongoData(result.data),
        pagination: result.pagination,
      });
    }

    const queryParams = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      destination: destination as string,
      author: author as string,
      public:
        isPublic === "true" ? true : isPublic === "false" ? false : undefined,
      search: search as string,
      sort: sort as string,
      order: (order as "asc" | "desc") || "desc",
    };

    if (queryParams.destination) {
      const { error } = objectIdSchema.validate(queryParams.destination);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid destination ID",
        });
      }
    }

    if (queryParams.author) {
      const { error } = objectIdSchema.validate(queryParams.author);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid author ID",
        });
      }
    }

    const result = await journalEntryService.getJournalEntries(queryParams);

    res.status(200).json({
      success: true,
      message: "Journal entries retrieved successfully",
      data: formatMongoData(result.data),
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Get journal entries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve journal entries",
      error: error.message,
    });
  }
};

// Get journal entries by destination ID
export const getJournalEntriesByDestination = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req.user as any)?.id;
    const { destinationId } = req.params;

    const { error } = objectIdSchema.validate(destinationId);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid destination ID",
      });
    }

    const entries = await journalEntryService.getJournalEntriesByDestination(
      destinationId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Journal entries retrieved successfully",
      data: formatMongoData(entries),
    });
  } catch (error: any) {
    console.error("Get journal entries by destination error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve journal entries for destination",
      error: error.message,
    });
  }
};

// Get journal entries by author ID
export const getJournalEntriesByAuthor = async (
  req: Request,
  res: Response
) => {
  try {
    const currentUserId = (req.user as any)?.id;
    const { authorId } = req.params;

    const { error } = objectIdSchema.validate(authorId);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    const entries = await journalEntryService.getJournalEntriesByAuthor(
      authorId,
      currentUserId
    );

    res.status(200).json({
      success: true,
      message: "Journal entries retrieved successfully",
      data: formatMongoData(entries),
    });
  } catch (error: any) {
    console.error("Get journal entries by author error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve author's journal entries",
      error: error.message,
    });
  }
};

// Get public journal entries (discovery feed)
export const getPublicJournalEntries = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, sort, order } = req.query;

    const queryParams = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      sort: sort as string,
      order: (order as "asc" | "desc") || "desc",
    };

    const result = await journalEntryService.getPublicJournalEntries(
      queryParams
    );

    res.status(200).json({
      success: true,
      message: "Public journal entries retrieved successfully",
      data: formatMongoData(result.data),
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Get public journal entries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve public journal entries",
      error: error.message,
    });
  }
};

// Get user's journal entry statistics
export const getJournalEntryStats = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const stats = await journalEntryService.getJournalEntryStats(userId);

    res.status(200).json({
      success: true,
      message: "Journal entry statistics retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("Get journal entry stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve journal entry statistics",
      error: error.message,
    });
  }
};

// Get user's recent journal entries (for dashboard)
export const getRecentJournalEntries = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { limit } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const limitNum = limit ? Math.min(Number(limit), 20) : 5;
    const entries = await journalEntryService.getRecentJournalEntries(
      userId,
      limitNum
    );

    res.status(200).json({
      success: true,
      message: "Recent journal entries retrieved successfully",
      data: formatMongoData(entries),
    });
  } catch (error: any) {
    console.error("Get recent journal entries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve recent journal entries",
      error: error.message,
    });
  }
};

// Get my journal entries (authenticated user's own entries)
export const getMyJournalEntries = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      page,
      limit,
      destination,
      public: isPublic,
      search,
      sort,
      order,
    } = req.query;

    const queryParams = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      author: userId,
      destination: destination as string,
      public:
        isPublic === "true" ? true : isPublic === "false" ? false : undefined,
      search: search as string,
      sort: sort as string,
      order: (order as "asc" | "desc") || "desc",
    };

    if (queryParams.destination) {
      const { error } = objectIdSchema.validate(queryParams.destination);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid destination ID",
        });
      }
    }

    const result = await journalEntryService.getJournalEntries(queryParams);

    res.status(200).json({
      success: true,
      message: "Your journal entries retrieved successfully",
      data: formatMongoData(result.data),
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Get my journal entries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve your journal entries",
      error: error.message,
    });
  }
};
