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
exports.deleteAvailability = exports.getAvailabilities = exports.createAvailability = void 0;
const Availability_1 = __importDefault(require("../models/Availability"));
const User_1 = __importDefault(require("../models/User"));
const createAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'lecturer') {
            res.status(403).json({ message: 'Only lecturers can create availability' });
            return;
        }
        const { date, startTime, endTime, allowedBatches } = req.body;
        const newAvailability = new Availability_1.default({
            lecturerId: req.user.userId,
            date,
            startTime,
            endTime,
            allowedBatches: allowedBatches || []
        });
        yield newAvailability.save();
        res.status(201).json(newAvailability);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createAvailability = createAvailability;
const getAvailabilities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { lecturerId, date } = req.query;
        let filter = {};
        if (lecturerId)
            filter.lecturerId = lecturerId;
        if (date)
            filter.date = new Date(date);
        // If student is requesting, only show available slots for their supervisor
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'student') {
            filter.status = 'available';
            const student = yield User_1.default.findById(req.user.userId);
            if (student === null || student === void 0 ? void 0 : student.supervisorId) {
                filter.lecturerId = student.supervisorId;
            }
        }
        else if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'lecturer') {
            filter.lecturerId = req.user.userId;
        }
        const availabilities = yield Availability_1.default.find(filter).populate('lecturerId', 'name email department');
        res.status(200).json(availabilities);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAvailabilities = getAvailabilities;
const deleteAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const availability = yield Availability_1.default.findById(id);
        if (!availability) {
            res.status(404).json({ message: 'Availability not found' });
            return;
        }
        if (availability.lecturerId.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        yield Availability_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Availability deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteAvailability = deleteAvailability;
