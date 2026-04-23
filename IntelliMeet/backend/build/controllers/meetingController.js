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
exports.updateMeetingStatus = exports.getMeetings = exports.bookMeeting = void 0;
const Meeting_1 = __importDefault(require("../models/Meeting"));
const Availability_1 = __importDefault(require("../models/Availability"));
const bookMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'student') {
            res.status(403).json({ message: 'Only students can book meetings' });
            return;
        }
        const { availabilityId, notes } = req.body;
        const availability = yield Availability_1.default.findById(availabilityId);
        if (!availability || availability.status !== 'available') {
            res.status(400).json({ message: 'Slot is not available' });
            return;
        }
        const newMeeting = new Meeting_1.default({
            studentId: req.user.userId,
            lecturerId: availability.lecturerId,
            availabilityId,
            notes,
            status: 'pending'
        });
        yield newMeeting.save();
        // Mark slot as booked
        availability.status = 'booked';
        yield availability.save();
        res.status(201).json(newMeeting);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.bookMeeting = bookMeeting;
const getMeetings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filter = {};
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (req.user.role === 'student') {
            filter.studentId = req.user.userId;
        }
        else {
            filter.lecturerId = req.user.userId;
        }
        const meetings = yield Meeting_1.default.find(filter)
            .populate('studentId', 'name email batch')
            .populate('lecturerId', 'name email department')
            .populate('availabilityId', 'date startTime endTime');
        res.status(200).json(meetings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getMeetings = getMeetings;
const updateMeetingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { status, meetingLink } = req.body;
        const meeting = yield Meeting_1.default.findById(id);
        if (!meeting) {
            res.status(404).json({ message: 'Meeting not found' });
            return;
        }
        // Access control check
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'student' && status !== 'cancelled') {
            res.status(403).json({ message: 'Students can only cancel meetings' });
            return;
        }
        meeting.status = status;
        if (meetingLink)
            meeting.meetingLink = meetingLink;
        yield meeting.save();
        // If cancelled, free up availability
        if (status === 'cancelled') {
            yield Availability_1.default.findByIdAndUpdate(meeting.availabilityId, { status: 'available' });
        }
        res.status(200).json(meeting);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateMeetingStatus = updateMeetingStatus;
