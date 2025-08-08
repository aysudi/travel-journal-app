import { verifyAccessToken } from "../utils/jwt.js";
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }
    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
};
