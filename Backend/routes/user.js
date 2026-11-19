import express from 'express';
import { 
    changePassword, 
    getPublicProfile, 
    getUserActivity, 
    getUserData, 
    getUsers, 
    login, 
    registration, 
    removeUser, 
    updateProfile,
    updateUserRole,
    subscribeNewsletter
} from '../controller/user.js';
import userAuthentication from '../middleware/userAuthentication.js';
import adminAuthentication from '../middleware/adminAuthentication.js';
import uploadFile from '../middleware/uploadFile.js';

const user = express.Router();

user.post("/registration", registration);
user.post("/login", login);
user.post("/newsletter", subscribeNewsletter);
user.get("/profile", userAuthentication, getUserData);
user.put("/profile", userAuthentication, uploadFile.single("avatar"), updateProfile);
user.get("/public/:userId", getPublicProfile);
user.get("/activity", userAuthentication, getUserActivity);
user.put("/change-password", userAuthentication, changePassword);
user.get("", adminAuthentication, getUsers);
user.delete("/:userId", adminAuthentication, removeUser);
user.patch("/:userId/role", adminAuthentication, updateUserRole);

export default user;