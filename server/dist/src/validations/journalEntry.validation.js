import Joi from "joi";
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
const journalEntryCreateSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required().messages({
        "string.empty": "Title is required",
        "string.max": "Title cannot exceed 200 characters",
    }),
    author: objectIdSchema.required().messages({
        "string.pattern.base": "Invalid author ID",
        "any.required": "Author ID is required",
    }),
    content: Joi.string().trim().min(1).max(5000).required().messages({
        "string.empty": "Content is required",
        "string.max": "Content cannot exceed 5000 characters",
    }),
    photos: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
        "array.max": "Cannot upload more than 10 photos",
    }),
    likes: Joi.array().items(objectIdSchema).optional(),
    comments: Joi.array().items(objectIdSchema).optional(),
    destination: objectIdSchema.required().messages({
        "string.pattern.base": "Invalid destination ID",
        "any.required": "Destination ID is required",
    }),
    public: Joi.boolean().optional(),
});
const journalEntryUpdateSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).optional().messages({
        "string.empty": "Title cannot be empty",
        "string.max": "Title cannot exceed 200 characters",
    }),
    content: Joi.string().trim().min(1).max(5000).optional().messages({
        "string.empty": "Content cannot be empty",
        "string.max": "Content cannot exceed 5000 characters",
    }),
    photos: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
        "array.max": "Cannot upload more than 10 photos",
    }),
    public: Joi.boolean().optional(),
    destination: Joi.forbidden(),
    author: Joi.forbidden(),
});
export { journalEntryCreateSchema, journalEntryUpdateSchema, objectIdSchema };
export default journalEntryCreateSchema;
