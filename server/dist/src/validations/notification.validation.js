import Joi from "joi";
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
const notificationCreateSchema = Joi.object({
    recipient: objectIdSchema.required().messages({
        "string.pattern.base": "Invalid recipient ID",
        "any.required": "Recipient ID is required",
    }),
    sender: objectIdSchema.optional().messages({
        "string.pattern.base": "Invalid sender ID",
    }),
    type: Joi.string()
        .valid("message", "list_invite", "list_shared", "journal_like", "destination_added", "system", "reminder")
        .required()
        .messages({
        "any.only": "Invalid notification type",
        "any.required": "Notification type is required",
    }),
    title: Joi.string().trim().min(1).max(100).required().messages({
        "string.empty": "Title is required",
        "string.max": "Title cannot exceed 100 characters",
    }),
    message: Joi.string().trim().min(1).max(500).required().messages({
        "string.empty": "Message is required",
        "string.max": "Message cannot exceed 500 characters",
    }),
    relatedMessage: objectIdSchema.optional(),
    relatedTravelList: objectIdSchema.optional(),
    relatedDestination: objectIdSchema.optional(),
    relatedJournalEntry: objectIdSchema.optional(),
    actionUrl: Joi.string().uri().optional(),
    expiresAt: Joi.date().optional(),
});
const notificationUpdateSchema = Joi.object({
    isRead: Joi.boolean().optional(),
    recipient: Joi.forbidden(),
    sender: Joi.forbidden(),
    type: Joi.forbidden(),
    title: Joi.forbidden(),
    message: Joi.forbidden(),
    relatedMessage: Joi.forbidden(),
    relatedTravelList: Joi.forbidden(),
    relatedDestination: Joi.forbidden(),
    relatedJournalEntry: Joi.forbidden(),
    actionUrl: Joi.forbidden(),
    expiresAt: Joi.forbidden(),
});
const notificationBulkReadSchema = Joi.object({
    notificationIds: Joi.array()
        .items(objectIdSchema)
        .min(1)
        .max(100)
        .optional()
        .messages({
        "array.min": "At least one notification ID is required",
        "array.max": "Cannot mark more than 100 notifications at once",
    }),
    markAllAsRead: Joi.boolean().optional(),
}).or("notificationIds", "markAllAsRead");
export { notificationCreateSchema, notificationUpdateSchema, notificationBulkReadSchema, objectIdSchema, };
export default notificationCreateSchema;
