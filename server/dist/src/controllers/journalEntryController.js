import * as journalEntryService from "../services/journalEntryService";
import { journalEntryCreateSchema, journalEntryUpdateSchema, objectIdSchema, } from "../validations/journalEntry.validation";
import formatMongoData from "../utils/formatMongoData";
// Create a new journal entry
export const createJournalEntry = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { error, value } = journalEntryCreateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map((detail) => detail.message),
            });
        }
        const journalEntry = await journalEntryService.createJournalEntry(value, userId);
        res.status(201).json({
            success: true,
            message: "Journal entry created successfully",
            data: formatMongoData(journalEntry),
        });
    }
    catch (error) {
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
};
// Get journal entry by ID
export const getJournalEntryById = async (req, res) => {
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
    }
    catch (error) {
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
export const updateJournalEntry = async (req, res) => {
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
        const updatedEntry = await journalEntryService.updateJournalEntry(id, value, userId);
        res.status(200).json({
            success: true,
            message: "Journal entry updated successfully",
            data: formatMongoData(updatedEntry),
        });
    }
    catch (error) {
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
};
// Delete journal entry
export const deleteJournalEntry = async (req, res) => {
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
                message: "Invalid journal entry ID",
            });
        }
        await journalEntryService.deleteJournalEntry(id, userId);
        res.status(200).json({
            success: true,
            message: "Journal entry deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete journal entry error:", error);
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
            message: "Failed to delete journal entry",
            error: error.message,
        });
    }
};
// Get journal entries with filtering, pagination, and search
export const getJournalEntries = async (req, res) => {
    try {
        const { page, limit, destination, author, travelListId, public: isPublic, search, sort, order, } = req.query;
        if (travelListId) {
            const { error } = objectIdSchema.validate(travelListId);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid travel list ID",
                });
            }
            const queryParams = {
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                author: author,
                public: isPublic === "true" ? true : isPublic === "false" ? false : undefined,
                search: search,
                sort: sort,
                order: order || "desc",
            };
            if (queryParams.author) {
                const { error: authorError } = objectIdSchema.validate(queryParams.author);
                if (authorError) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid author ID",
                    });
                }
            }
            const result = await journalEntryService.getJournalEntriesByTravelList(travelListId, queryParams);
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
            destination: destination,
            author: author,
            public: isPublic === "true" ? true : isPublic === "false" ? false : undefined,
            search: search,
            sort: sort,
            order: order || "desc",
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
    }
    catch (error) {
        console.error("Get journal entries error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve journal entries",
            error: error.message,
        });
    }
};
// Get journal entries by destination ID
export const getJournalEntriesByDestination = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { destinationId } = req.params;
        const { error } = objectIdSchema.validate(destinationId);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid destination ID",
            });
        }
        const entries = await journalEntryService.getJournalEntriesByDestination(destinationId, userId);
        res.status(200).json({
            success: true,
            message: "Journal entries retrieved successfully",
            data: formatMongoData(entries),
        });
    }
    catch (error) {
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
export const getJournalEntriesByAuthor = async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        const { authorId } = req.params;
        const { error } = objectIdSchema.validate(authorId);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid author ID",
            });
        }
        const entries = await journalEntryService.getJournalEntriesByAuthor(authorId, currentUserId);
        res.status(200).json({
            success: true,
            message: "Journal entries retrieved successfully",
            data: formatMongoData(entries),
        });
    }
    catch (error) {
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
export const getPublicJournalEntries = async (req, res) => {
    try {
        const { page, limit, search, sort, order } = req.query;
        const queryParams = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search,
            sort: sort,
            order: order || "desc",
        };
        const result = await journalEntryService.getPublicJournalEntries(queryParams);
        res.status(200).json({
            success: true,
            message: "Public journal entries retrieved successfully",
            data: formatMongoData(result.data),
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Get public journal entries error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve public journal entries",
            error: error.message,
        });
    }
};
// Get user's journal entry statistics
export const getJournalEntryStats = async (req, res) => {
    try {
        const userId = req.user?.id;
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
    }
    catch (error) {
        console.error("Get journal entry stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve journal entry statistics",
            error: error.message,
        });
    }
};
// Get user's recent journal entries (for dashboard)
export const getRecentJournalEntries = async (req, res) => {
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
        const entries = await journalEntryService.getRecentJournalEntries(userId, limitNum);
        res.status(200).json({
            success: true,
            message: "Recent journal entries retrieved successfully",
            data: formatMongoData(entries),
        });
    }
    catch (error) {
        console.error("Get recent journal entries error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve recent journal entries",
            error: error.message,
        });
    }
};
// Bulk update journal entries (for privacy settings)
export const bulkUpdateJournalEntries = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { entryIds, updateData } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        if (!Array.isArray(entryIds) || entryIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Entry IDs array is required and cannot be empty",
            });
        }
        for (const id of entryIds) {
            const { error } = objectIdSchema.validate(id);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid entry ID: ${id}`,
                });
            }
        }
        const { error, value } = journalEntryUpdateSchema.validate(updateData);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map((detail) => detail.message),
            });
        }
        const result = await journalEntryService.bulkUpdateJournalEntries(entryIds, value, userId);
        res.status(200).json({
            success: true,
            message: "Journal entries updated successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Bulk update journal entries error:", error);
        if (error.message.includes("permission")) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed to update journal entries",
            error: error.message,
        });
    }
};
// Get my journal entries (authenticated user's own entries)
export const getMyJournalEntries = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { page, limit, destination, public: isPublic, search, sort, order, } = req.query;
        const queryParams = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            author: userId,
            destination: destination,
            public: isPublic === "true" ? true : isPublic === "false" ? false : undefined,
            search: search,
            sort: sort,
            order: order || "desc",
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
    }
    catch (error) {
        console.error("Get my journal entries error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve your journal entries",
            error: error.message,
        });
    }
};
