import Joi from "joi";

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const travelListCreateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title cannot exceed 100 characters",
  }),

  description: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  tags: Joi.array()
    .items(
      Joi.string().trim().max(30).messages({
        "string.max": "Each tag cannot exceed 30 characters",
      })
    )
    .max(10)
    .optional()
    .messages({
      "array.max": "Cannot have more than 10 tags",
    }),

  isPublic: Joi.boolean().optional(),

  coverImage: Joi.string().uri().optional(),

  collaborators: Joi.array().items(objectIdSchema).optional(),
});

const travelListUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional().messages({
    "string.empty": "Title cannot be empty",
    "string.max": "Title cannot exceed 100 characters",
  }),

  description: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  tags: Joi.array()
    .items(
      Joi.string().trim().max(30).messages({
        "string.max": "Each tag cannot exceed 30 characters",
      })
    )
    .max(10)
    .optional()
    .messages({
      "array.max": "Cannot have more than 10 tags",
    }),

  isPublic: Joi.boolean().optional(),

  coverImage: Joi.string().uri().optional().allow(""),

  collaborators: Joi.array().items(objectIdSchema).optional(),

  owner: Joi.forbidden(),
  destinations: Joi.forbidden(),
  chat: Joi.forbidden(),
});

export { travelListCreateSchema, travelListUpdateSchema, objectIdSchema };

export default travelListCreateSchema;
