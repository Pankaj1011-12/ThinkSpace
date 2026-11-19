import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import UserModel from "../models/userSchema.js";
import PostModel from '../models/postSchema.js';
import ProductModel from '../models/productSchema.js';
import TaskModel from '../models/taskSchema.js';

const registration = [
    check('fullName').matches(/^[a-zA-Z ]+$/).withMessage('Only alphabets and spaces are allowed in full name'),
    check('email').isEmail().withMessage('Enter a Valid Email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one digit'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ status: false, message: errors.array()[0].msg });
            }

            const { fullName, email, password } = req.body;
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ status: false, message: "User already exists with this email" });
            }

            const bcryptSaltRounds = parseInt(process.env.BCRYPT_GEN_SALT_NUMBER) || 10;
            const bcryptSalt = await bcrypt.genSalt(bcryptSaltRounds);
            const hashPassword = await bcrypt.hash(password, bcryptSalt);

            const userData = new UserModel({
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                password: hashPassword,
                createdAt: new Date(),
                role: "user"
            });
            const savedUser = await userData.save();
            if (savedUser) {
                const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.COOKIE_EXPIRES || '5d' });
                const safeUser = savedUser.toObject();
                delete safeUser.password;
                return res.status(201).json({ status: true, message: "Registration Successful", token, user: safeUser });
            } else {
                return res.status(500).json({ status: false, message: "Something Went Wrong" });
            }
        } catch (error) {
            console.error("Error in registration:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
];

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        const existingUser = await UserModel.findOne({ email: email.trim().toLowerCase() });
        if (!existingUser) {
            return res.status(401).json({ status: false, message: "Invalid Email or User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Wrong Password" });
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.COOKIE_EXPIRES || '5d' });
        const safeUser = existingUser.toObject();
        delete safeUser.password;

        return res.status(200).json({ status: true, message: "Login Successful", token, user: safeUser });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const getUserData = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalPosts = await PostModel.countDocuments({ authorId: userId });
        const totalProducts = await ProductModel.countDocuments({ authorId: userId });
        const ongoingTasks = await TaskModel.countDocuments({ authorId: userId, taskStatus: 'ongoing' });

        const user = req.user.toObject();
        delete user.password;
        user.totalPosts = totalPosts;
        user.totalProducts = totalProducts;
        user.ongoingTasks = ongoingTasks;

        return res.status(200).json({ status: true, message: "Data Fetched Successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const getPublicProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: false, message: "Invalid User ID" });
        }

        const user = await UserModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const posts = await PostModel.find({ authorId: userId, visibility: "public" })
            .sort({ createdAt: -1 })
            .lean();

        const formattedPosts = posts.map(p => ({
            _id: p._id,
            title: p.title,
            tags: p.tags,
            description: p.description,
            createdAt: p.createdAt,
            likesCount: p.reactions ? p.reactions.length : 0,
            commentsCount: p.comments ? p.comments.length : 0
        }));

        const books = await ProductModel.find({ authorId: userId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                bio: user.bio || "",
                image: user.image,
                createdAt: user.createdAt,
                role: user.role
            },
            totalPosts: formattedPosts.length,
            totalBooks: books.length,
            posts: formattedPosts,
            books
        });
    } catch (error) {
        console.error("Error in getPublicProfile:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, bio } = req.body;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (fullName && fullName.trim()) user.fullName = fullName.trim();
        if (bio !== undefined) user.bio = bio.trim();

        if (req.file) {
            user.image = req.file.filename;
        }

        const updatedUser = await user.save();
        const safeUser = updatedUser.toObject();
        delete safeUser.password;

        return res.status(200).json({
            status: true,
            message: "Profile updated successfully",
            user: safeUser
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ status: false, message: "New password must be at least 8 characters long" });
        }

        const existingUser = await UserModel.findById(req.user._id);
        if (!existingUser) {
            return res.status(401).json({ status: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Wrong current password" });
        }

        const bcryptSaltRounds = parseInt(process.env.BCRYPT_GEN_SALT_NUMBER) || 10;
        const bcryptSalt = await bcrypt.genSalt(bcryptSaltRounds);
        const hashPassword = await bcrypt.hash(newPassword, bcryptSalt);

        await UserModel.findByIdAndUpdate(req.user._id, { password: hashPassword });
        return res.status(200).json({ status: true, message: "Password Changed Successfully" });
    } catch (error) {
        console.error("Error in changePassword:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const { query } = req.query;
        let users = null;

        if (query) {
            users = await UserModel.find({
                $or: [
                    { fullName: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } }
                ]
            }).select("-password");
        } else {
            users = await UserModel.find().select("-password");
        }

        return res.status(200).json({ status: true, message: "Data Fetched Successfully", users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const getUserActivity = async (req, res) => {
    try {
        const { _id: userId } = req.user;

        const days = 371;
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - (days - 1));

        const activityMap = {};
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const key = date.toISOString().split("T")[0];
            activityMap[key] = 0;
        }

        const dateFilter = {
            createdAt: {
                $gte: startDate,
                $lte: today,
            },
        };

        const [
            posts,
            products,
            tasksCreated,
            updatedTasks,
            commentsAgg,
            reactionsAgg,
            userDoc,
        ] = await Promise.all([
            PostModel.find({ authorId: userId, ...dateFilter }, "createdAt"),
            ProductModel.find({ authorId: userId, ...dateFilter }, "createdAt"),
            TaskModel.find({ authorId: userId, ...dateFilter }, "createdAt"),
            TaskModel.find({
                authorId: userId,
                updatedAt: { $gte: startDate, $lte: today },
            }, "updatedAt"),
            PostModel.aggregate([
                { $unwind: "$comments" },
                {
                    $match: {
                        "comments.userId": userId,
                        "comments.createdAt": {
                            $gte: startDate,
                            $lte: today,
                        },
                    },
                },
                {
                    $project: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$comments.createdAt",
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$date",
                        count: { $sum: 1 },
                    },
                },
            ]),
            PostModel.aggregate([
                { $unwind: "$reactions" },
                {
                    $match: {
                        "reactions.userId": userId,
                        "reactions.createdAt": {
                            $gte: startDate,
                            $lte: today,
                        },
                    },
                },
                {
                    $project: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$reactions.createdAt",
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$date",
                        count: { $sum: 1 },
                    },
                },
            ]),
            UserModel.findById(userId),
        ]);

        const countByDate = (docs, dateField = "createdAt") => {
            docs.forEach((doc) => {
                const key = doc[dateField].toISOString().split("T")[0];
                if (activityMap[key] !== undefined) activityMap[key]++;
            });
        };

        countByDate(posts);
        countByDate(products);
        countByDate(tasksCreated);
        countByDate(updatedTasks, "updatedAt");

        commentsAgg.forEach(({ _id, count }) => {
            if (activityMap[_id] !== undefined) activityMap[_id] += count;
        });

        reactionsAgg.forEach(({ _id, count }) => {
            if (activityMap[_id] !== undefined) activityMap[_id] += count;
        });

        if (userDoc) {
            const createdKey = userDoc.createdAt.toISOString().split("T")[0];
            if (activityMap[createdKey] !== undefined) activityMap[createdKey]++;
        }

        const userActivity = Object.entries(activityMap).map(([date, activity]) => ({
            date,
            activity,
        }));

        return res.status(200).json({ status: true, message: "Data Fetched Successfully", userActivity });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const removeUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        await UserModel.findByIdAndDelete(userId);
        return res.status(200).json({ status: true, message: "User Deleted Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ status: false, message: "Invalid role specified" });
        }
        const updated = await UserModel.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
        if (!updated) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        return res.status(200).json({ status: true, message: `User role updated to ${role} successfully`, user: updated });
    } catch (error) {
        console.error("Error updating user role:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes("@")) {
            return res.status(400).json({ status: false, message: "Please provide a valid email address" });
        }
        return res.status(200).json({ status: true, message: "Thank you for subscribing to the ThinkSpace newsletter!" });
    } catch (error) {
        console.error("Newsletter error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export { 
    registration, 
    login, 
    getUserData, 
    getPublicProfile, 
    updateProfile, 
    changePassword, 
    getUsers, 
    removeUser, 
    updateUserRole,
    subscribeNewsletter,
    getUserActivity 
};