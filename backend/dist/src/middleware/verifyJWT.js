import jwt from "jsonwebtoken";
export const verifyJWT = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        req.admin = {
            id: decoded.adminInfo.id,
            email: decoded.adminInfo.email,
        };
        next();
    });
};
