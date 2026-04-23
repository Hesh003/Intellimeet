"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationRead = exports.getNotifications = exports.editProfile = exports.getAssignedStudents = exports.toggleStatus = void 0;
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = __importDefault(require("../models/Notification"));
// Toggle Online Status
const toggleStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'lecturer') {
            res.status(403).json({ message: 'Only lecturers can toggle status' });
            return;
        }
        const { isOnline } = req.body;
        const user = yield User_1.default.findById(req.user.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.isOnline = isOnline;
        yield user.save();
        // Trigger Notification for all bound students
        const students = yield User_1.default.find({ supervisorId: user._id });
        const notificationPromises = students.map(student => {
            const notif = new Notification_1.default({
                userId: student._id,
                title: 'Status Update',
                message: `Your supervisor, ${user.name}, is now ${isOnline ? 'Online' : 'Offline'}.`
            });
            return notif.save();
        });
        yield Promise.all(notificationPromises);
        res.status(200).json({ isOnline: user.isOnline });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.toggleStatus = toggleStatus;
// Get Assigned Students
const getAssignedStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'lecturer') {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const students = yield User_1.default.find({ supervisorId: req.user.userId })
            .select('name email idNumber batch program expoPushToken');
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAssignedStudents = getAssignedStudents;
// Edit Profile
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, batch, program } = req.body;
        // We strictly prevent editing email, role, idNumber, or supervisorId here for security.
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (name)
            user.name = name;
        if (batch)
            user.batch = batch;
        if (program)
            user.program = program;
        yield user.save();
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            batch: user.batch,
            program: user.program,
            idNumber: user.idNumber,
            supervisorId: user.supervisorId
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.editProfile = editProfile;
// Get Notifications
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const limit = parseInt(req.query.limit) || 20;
        const notifications = yield Notification_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId })
            .sort({ createdAt: -1 })
            .limit(limit);
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getNotifications = getNotifications;
// Mark Notification Read
const markNotificationRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Notification_1.default.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.markNotificationRead = markNotificationRead;
