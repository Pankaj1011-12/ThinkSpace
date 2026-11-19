import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import UserModel from "../models/userSchema.js";

const optionalUserAuth = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (authorization && authorization.startsWith("Bearer ")) {
            const token = authorization.split(" ")[1];
            if (token && token !== "null" && token !== "undefined") {
                try {
                    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
                    if (Types.ObjectId.isValid(userId)) {
                        const user = await UserModel.findById(userId).select("-password");
                        if (user) {
                            req.user = user;
                        }
                    }
                } catch (e) {
                    // Ignore expired/invalid token for optional auth
                }
            }
        }
        return next();
    } catch (error) {
        return next();
    }
};

export default optionalUserAuth;
