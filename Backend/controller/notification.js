import NotificationModel from "../models/notificationSchema.js";

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await NotificationModel.find({ recipient: userId })
            .populate('sender', 'fullName email image')
            .sort({ createdAt: -1 })
            .limit(30);

        return res.status(200).json({ status: true, notifications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await NotificationModel.countDocuments({ recipient: userId, read: false });
        return res.status(200).json({ status: true, count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user._id;

        const updated = await NotificationModel.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ status: false, message: "Notification not found" });
        }

        return res.status(200).json({ status: true, message: "Marked as read", notification: updated });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        await NotificationModel.updateMany({ recipient: userId, read: false }, { read: true });
        return res.status(200).json({ status: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export { getNotifications, getUnreadCount, markAsRead, markAllAsRead };
