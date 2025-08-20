import Joi from "joi";
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
const destinationCreateSchema = Joi.object({
    name: Joi.string().trim().min(1).max(100).required().messages({
        "string.empty": "Destination name is required",
        "string.max": "Destination name cannot exceed 100 characters",
    }),
    location: Joi.string().trim().min(1).max(50).required().messages({
        "string.empty": "Location is required",
        "string.max": "Location name cannot exceed 50 characters",
    }),
    datePlanned: Joi.date().optional(),
    dateVisited: Joi.date().optional(),
    status: Joi.string().valid("Wishlist", "Planned", "Visited").optional(),
    notes: Joi.string().max(1000).optional().allow("").messages({
        "string.max": "Notes cannot exceed 1000 characters",
    }),
    images: Joi.array().items(Joi.string().uri()).optional(),
    list: objectIdSchema.required().messages({
        "string.pattern.base": "Invalid travel list ID",
        "any.required": "Travel list ID is required",
    }),
});
const destinationUpdateSchema = Joi.object({
    name: Joi.string().trim().min(1).max(100).optional().messages({
        "string.empty": "Destination name cannot be empty",
        "string.max": "Destination name cannot exceed 100 characters",
    }),
    location: Joi.string().trim().min(1).max(50).optional().messages({
        "string.empty": "Location cannot be empty",
        "string.max": "Location name cannot exceed 50 characters",
    }),
    datePlanned: Joi.date().optional().allow(null),
    dateVisited: Joi.date().optional().allow(null),
    status: Joi.string().valid("Wishlist", "Planned", "Visited").optional(),
    notes: Joi.string().max(1000).optional().allow("").messages({
        "string.max": "Notes cannot exceed 1000 characters",
    }),
    images: Joi.array().items(Joi.string().uri()).optional(),
    listId: Joi.forbidden(),
});
const destinationStatusSchema = Joi.object({
    status: Joi.string()
        .valid("Wishlist", "Planned", "Visited")
        .required()
        .messages({
        "any.only": "Status must be either Wishlist, Planned, or Visited",
        "any.required": "Status is required",
    }),
    dateVisited: Joi.date().when("status", {
        is: "Visited",
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
    }),
});
export { destinationCreateSchema, destinationUpdateSchema, destinationStatusSchema, objectIdSchema, };
export default destinationCreateSchema;
