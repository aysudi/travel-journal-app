export const errorHandler = (err, _, res, next) => {
    res.status(500).json({
        message: err.message || "Internal server error",
    });
};
