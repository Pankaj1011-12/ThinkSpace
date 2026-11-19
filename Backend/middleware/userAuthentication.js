import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import UserModel from "../models/userSchema.js";

const userAuthentication = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (authorization && authorization.startsWith("Bearer ")) {
            const authorizationToken = authorization.split(" ")[1];
            if (authorizationToken && authorizationToken !== "null" && authorizationToken !== "undefined") {
                try {
                    const { userId } = jwt.verify(authorizationToken, process.env.JWT_SECRET_KEY);
                    if (Types.ObjectId.isValid(userId)) {
                        const user = await UserModel.findById(userId).select("-password");
                        if (user && (user.role === "user" || user.role === "admin")) {
                            req.user = user;
                            return next();
                        } else {
                            return res.status(403).json({ status: false, message: "User account not found or access denied" });
                        }
                    } else {
                        return res.status(403).json({ status: false, message: "Invalid user identifier" });
                    }
                } catch (jwtErr) {
                    return res.status(401).json({ status: false, message: "Session expired or invalid token. Please log in again." });
                }
            } else {
                return res.status(401).json({ status: false, message: "Authorization token missing" });
            }
        } else {
            return res.status(401).json({ status: false, message: "Unauthorized. Please log in." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export default userAuthentication;