import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try { // Get the token from headers
        const authHeader = req.headers.authorization;

        if (! authHeader || ! authHeader.startsWith("Bearer ")) {
            return res.status(401).json({success: false, message: "Unauthorized: No token provided"});
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to the request
        req.user = {
            id: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({success: false, message: "Unauthorized: Invalid or expired token"});
    }
};

export default authMiddleware;
