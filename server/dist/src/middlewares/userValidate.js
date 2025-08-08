import { userRegistrationSchema } from "../validations/user.validation.js";
const userValidate = (req, res, next) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        return res.status(400).json({
            success: false,
            message: errorMessage,
        });
    }
    else {
        next();
    }
};
export default userValidate;
