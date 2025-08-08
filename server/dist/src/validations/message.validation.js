import Joi from "joi";
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
const messageCreateSchema = Joi.object({
    content: Joi.string().trim().min(1).max(1000).required().messages({
        "string.empty": "Message content is required",
        "string.max": "Message cannot exceed 1000 characters",
    }),
    list: objectIdSchema.required().messages({
        "string.pattern.base": "Invalid travel list ID",
        "any.required": "Travel list ID is required",
    }),
});
const messageUpdateSchema = Joi.object({
    content: Joi.string().trim().min(1).max(1000).required().messages({
        "string.empty": "Message content cannot be empty",
        "string.max": "Message cannot exceed 1000 characters",
    }),
    sender: Joi.forbidden(),
    list: Joi.forbidden(),
});
export { messageCreateSchema, messageUpdateSchema, objectIdSchema };
export default messageCreateSchema;
