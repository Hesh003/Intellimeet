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
exports.addFeedback = exports.getProposals = exports.submitProposal = void 0;
const Proposal_1 = __importDefault(require("../models/Proposal"));
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = __importDefault(require("../models/Notification"));
const submitProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'student') {
            res.status(403).json({ message: 'Only students can submit proposals' });
            return;
        }
        const { title, content } = req.body;
        let documentUrl;
        if (req.file) {
            documentUrl = `/uploads/${req.file.filename}`;
        }
        const newProposal = new Proposal_1.default({
            studentId: req.user.userId,
            title,
            content,
            documentUrl,
        });
        yield newProposal.save();
        // Notify the bound supervisor
        const student = yield User_1.default.findById(req.user.userId);
        if (student === null || student === void 0 ? void 0 : student.supervisorId) {
            const notif = new Notification_1.default({
                userId: student.supervisorId,
                title: 'New Proposal Submitted',
                message: `${student.name} has submitted a new proposal: ${title}`
            });
            yield notif.save();
        }
        res.status(201).json(newProposal);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.submitProposal = submitProposal;
const getProposals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let filter = {};
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'student') {
            filter.studentId = req.user.userId;
        }
        else {
            // If lecturer, only show proposals of their assigned students
            const assignedStudents = yield User_1.default.find({ supervisorId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId }).select('_id');
            const studentIds = assignedStudents.map(s => s._id);
            filter.studentId = { $in: studentIds };
        }
        const proposals = yield Proposal_1.default.find(filter)
            .populate('studentId', 'name email idNumber')
            .populate('manualFeedback.lecturerId', 'name');
        res.status(200).json(proposals);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getProposals = getProposals;
const addFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'lecturer') {
            res.status(403).json({ message: 'Only lecturers can provide feedback' });
            return;
        }
        const { id } = req.params;
        const { message } = req.body;
        const proposal = yield Proposal_1.default.findById(id);
        if (!proposal) {
            res.status(404).json({ message: 'Proposal not found' });
            return;
        }
        proposal.manualFeedback.push({
            message,
            lecturerId: req.user.userId,
            createdAt: new Date()
        });
        proposal.status = 'evaluated';
        yield proposal.save();
        // Trigger Notification to student
        const lecturer = yield User_1.default.findById(req.user.userId);
        const notif = new Notification_1.default({
            userId: proposal.studentId,
            title: 'New Feedback Received',
            message: `${lecturer === null || lecturer === void 0 ? void 0 : lecturer.name} has reviewed your proposal: ${proposal.title}`
        });
        yield notif.save();
        res.status(200).json(proposal);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.addFeedback = addFeedback;
