import Joi from "joi";
const userRegistrationSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(100).required().messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 2 characters long",
        "string.max": "Full name cannot exceed 100 characters",
    }),
    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .required()
        .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username cannot exceed 30 characters",
        "string.pattern.base": "Username can only contain letters, numbers, and underscores",
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
    }),
    profileImage: Joi.string().optional(),
    password: Joi.string()
        .min(6)
        .when("provider", {
        is: "local",
        then: Joi.required(),
        otherwise: Joi.optional(),
    })
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
    provider: Joi.string().valid("local", "google", "github").default("local"),
    providerId: Joi.string().allow(null, "").optional(),
    socketId: Joi.string().allow(null, "").optional(),
});
const userLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    }),
});
const userUpdateSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(100).optional().messages({
        "string.min": "Full name must be at least 2 characters long",
        "string.max": "Full name cannot exceed 100 characters",
    }),
    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .optional()
        .messages({
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username cannot exceed 30 characters",
        "string.pattern.base": "Username can only contain letters, numbers, and underscores",
    }),
    profileImage: Joi.string().uri().optional(),
    profileVisibility: Joi.string().valid("public", "private").optional(),
    email: Joi.forbidden(),
    password: Joi.forbidden(),
    provider: Joi.forbidden(),
    providerId: Joi.forbidden(),
    isVerified: Joi.forbidden(),
    premium: Joi.forbidden(),
    lists: Joi.forbidden(),
});
const passwordChangeSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        "string.empty": "Current password is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
        "string.empty": "New password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
        "any.only": "Passwords do not match",
        "string.empty": "Password confirmation is required",
    }),
});
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
export { userRegistrationSchema, userLoginSchema, userUpdateSchema, passwordChangeSchema, objectIdSchema, };
export default userRegistrationSchema;
