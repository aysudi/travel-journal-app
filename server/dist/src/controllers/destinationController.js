import * as destinationService from "../services/destinationService";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { destinationCreateSchema, destinationUpdateSchema, destinationStatusSchema, objectIdSchema, } from "../validations/destination.validation";
import formatMongoData from "../utils/formatMongoData";
const upload = multer({ storage: multer.memoryStorage() });
// Create a new destination
export const createDestination = [
    upload.array("images", 10),
    async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }
            const { error, value } = destinationCreateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const destinationData = { ...value };
            if (destinationData.country) {
                destinationData.location = destinationData.country;
                delete destinationData.country;
            }
            let imageUrls = [];
            if (req.files && Array.isArray(req.files)) {
                for (const file of req.files) {
                    await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream({ folder: "destinations" }, (error, result) => {
                            if (error)
                                reject(error);
                            else {
                                if (result?.secure_url)
                                    imageUrls.push(result.secure_url);
                                resolve(result);
                            }
                        });
                        stream.end(file.buffer);
                    });
                }
            }
            destinationData.images = imageUrls;
            const destination = await destinationService.createDestination(destinationData, userId);
            res.status(201).json({
                success: true,
                message: "Destination created successfully",
                data: formatMongoData(destination),
            });
        }
        catch (error) {
            console.error("Create destination error:", error);
            if (error.message && error.message.includes("Travel list not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            if (error.message && error.message.includes("permission")) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }
            res.status(500).json({
                success: false,
                message: "Failed to create destination",
                error: error.message,
            });
        }
    },
];
// Get destination by ID
export const getDestinationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = objectIdSchema.validate(id);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid destination ID",
            });
        }
        const destination = await destinationService.getDestinationById(id);
        res.status(200).json({
            success: true,
            message: "Destination retrieved successfully",
            data: formatMongoData(destination),
        });
    }
    catch (error) {
        console.error("Get destination error:", error);
        if (error.message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed to retrieve destination",
            error: error.message,
        });
    }
};
// Update destination
export const updateDestination = [
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "newImages", maxCount: 10 },
    ]),
    async (req, res) => {
        try {
            if (req.body.images && typeof req.body.images === "string") {
                try {
                    req.body.images = JSON.parse(req.body.images);
                }
                catch {
                    req.body.images = [];
                }
            }
            const userId = req.user?.id;
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
                    message: "Invalid destination ID",
                });
            }
            if ("id" in req.body) {
                delete req.body.id;
            }
            const { error, value } = destinationUpdateSchema.validate(req.body);
            console.log(error);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const updateData = { ...value };
            console.log("update data: ", updateData);
            if (updateData.country) {
                updateData.location = updateData.country;
                delete updateData.country;
            }
            if ("id" in req.body) {
                delete req.body.id;
            }
            if ("list" in req.body) {
                delete req.body.list;
            }
            let imagesFromClient = Array.isArray(req.body.images)
                ? req.body.images
                : [];
            let imageUrls = [];
            if (req.files && req.files["newImages"]) {
                const newImages = req.files["newImages"];
                for (const file of newImages) {
                    await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream({ folder: "destinations" }, (error, result) => {
                            if (error)
                                reject(error);
                            else {
                                if (result?.secure_url)
                                    imageUrls.push(result.secure_url);
                                resolve(result);
                            }
                        });
                        stream.end(file.buffer);
                    });
                }
            }
            updateData.images = [...imagesFromClient, ...imageUrls];
            const updatedDestination = await destinationService.updateDestination(id, updateData, userId);
            res.status(200).json({
                success: true,
                message: "Destination updated successfully",
                data: formatMongoData(updatedDestination),
            });
        }
        catch (error) {
            console.error("Update destination error:", error);
            if (error.message && error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            if (error.message && error.message.includes("permission")) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }
            res.status(500).json({
                success: false,
                message: "Failed to update destination",
                error: error.message,
            });
        }
    },
];
// Delete destination
export const deleteDestination = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { error } = objectIdSchema.validate(id);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid destination ID",
            });
        }
        const oldDestination = await destinationService.getDestinationById(id);
        if (oldDestination.images && oldDestination.images.length > 0) {
            for (const url of oldDestination.images) {
                const parts = url.split("/");
                const folder = parts[parts.length - 2];
                const filename = parts[parts.length - 1].split(".")[0];
                const publicId = `destinations/${filename}`;
                try {
                    await cloudinary.uploader.destroy(publicId);
                }
                catch { }
            }
        }
        await destinationService.deleteDestination(id, userId);
        res.status(200).json({
            success: true,
            message: "Destination deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete destination error:", error);
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
            message: "Failed to delete destination",
            error: error.message,
        });
    }
};
// Get destinations with filtering, pagination, and search
export const getDestinations = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { list, status, search, sort } = req.query;
        const queryParams = {
            list: list,
            status: status,
            search: search,
            sort: sort,
            userId: userId,
        };
        if (queryParams.list) {
            const { error } = objectIdSchema.validate(queryParams.list);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid travel list ID",
                });
            }
        }
        const destinations = await destinationService.getDestinations(queryParams);
        res.status(200).json({
            success: true,
            message: "Destinations retrieved successfully",
            data: formatMongoData(destinations),
        });
    }
    catch (error) {
        console.error("Get destinations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve destinations",
            error: error.message,
        });
    }
};
// Get destinations by travel list ID
export const getDestinationsByTravelList = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { listId } = req.params;
        const { error } = objectIdSchema.validate(listId);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid travel list ID",
            });
        }
        const destinations = await destinationService.getDestinationsByTravelList(listId, userId);
        res.status(200).json({
            success: true,
            message: "Destinations retrieved successfully",
            data: formatMongoData(destinations),
        });
    }
    catch (error) {
        console.error("Get destinations by travel list error:", error);
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
            message: "Failed to retrieve destinations for travel list",
            error: error.message,
        });
    }
};
// Get destinations by status
export const getDestinationsByStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { status } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        if (!["Wishlist", "Planned", "Visited"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be Wishlist, Planned, or Visited",
            });
        }
        const destinations = await destinationService.getDestinationsByStatus(status, userId);
        res.status(200).json({
            success: true,
            message: "Destinations retrieved successfully",
            data: formatMongoData(destinations),
        });
    }
    catch (error) {
        console.error("Get destinations by status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve destinations by status",
            error: error.message,
        });
    }
};
// Get destination statistics
export const getDestinationStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const stats = await destinationService.getDestinationStats(userId);
        res.status(200).json({
            success: true,
            message: "Destination statistics retrieved successfully",
            data: stats,
        });
    }
    catch (error) {
        console.error("Get destination stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve destination statistics",
            error: error.message,
        });
    }
};
// Update destination status
export const updateDestinationStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
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
                message: "Invalid destination ID",
            });
        }
        const { error, value } = destinationStatusSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map((detail) => detail.message),
            });
        }
        const updatedDestination = await destinationService.updateDestinationStatus(id, value.status, userId);
        res.status(200).json({
            success: true,
            message: "Destination status updated successfully",
            data: formatMongoData(updatedDestination),
        });
    }
    catch (error) {
        console.error("Update destination status error:", error);
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
            message: "Failed to update destination status",
            error: error.message,
        });
    }
};
// Bulk update destination status
export const bulkUpdateDestinationStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { destinationIds, status } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        if (!Array.isArray(destinationIds) || destinationIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Destination IDs array is required and cannot be empty",
            });
        }
        if (!["Wishlist", "Planned", "Visited"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be Wishlist, Planned, or Visited",
            });
        }
        for (const id of destinationIds) {
            const { error } = objectIdSchema.validate(id);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid destination ID: ${id}`,
                });
            }
        }
        const result = await destinationService.bulkUpdateDestinationStatus(destinationIds, status, userId);
        res.status(200).json({
            success: true,
            message: "Destination statuses updated successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Bulk update destination status error:", error);
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
            message: "Failed to update destination statuses",
            error: error.message,
        });
    }
};
// Get recent destinations for dashboard
export const getRecentDestinations = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { limit } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const limitNum = limit ? Math.min(Number(limit), 20) : 5;
        const destinations = await destinationService.getRecentDestinations(userId, limitNum);
        res.status(200).json({
            success: true,
            message: "Recent destinations retrieved successfully",
            data: formatMongoData(destinations),
        });
    }
    catch (error) {
        console.error("Get recent destinations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve recent destinations",
            error: error.message,
        });
    }
};
// Search destinations
export const searchDestinations = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { query: searchQuery, status, limit } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        if (!searchQuery || typeof searchQuery !== "string") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }
        if (status &&
            !["Wishlist", "Planned", "Visited"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be Wishlist, Planned, or Visited",
            });
        }
        const options = {
            status: status,
            limit: limit ? Math.min(Number(limit), 100) : 50,
        };
        const destinations = await destinationService.searchDestinations(searchQuery, userId, options);
        res.status(200).json({
            success: true,
            message: "Destinations searched successfully",
            data: formatMongoData(destinations),
        });
    }
    catch (error) {
        console.error("Search destinations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search destinations",
            error: error.message,
        });
    }
};
