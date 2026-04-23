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
exports.getSupervisors = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_me';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, batch, program, idNumber, supervisorId } = req.body;
        if (role === 'student' && !supervisorId) {
            res.status(400).json({ message: 'Students must select a supervisor' });
            return;
        }
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        const newUser = new User_1.default({
            name,
            email,
            passwordHash,
            role,
            batch,
            program,
            idNumber,
            supervisorId
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                batch: newUser.batch,
                program: newUser.program,
                idNumber: newUser.idNumber,
                supervisorId: newUser.supervisorId
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                batch: user.batch,
                program: user.program,
                idNumber: user.idNumber,
                supervisorId: user.supervisorId
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.login = login;
const getSupervisors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supervisors = yield User_1.default.find({ role: 'lecturer' }).select('name email idNumber isOnline');
        res.status(200).json(supervisors);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getSupervisors = getSupervisors;
