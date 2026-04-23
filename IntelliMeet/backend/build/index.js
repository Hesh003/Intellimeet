"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const availabilityRoutes_1 = __importDefault(require("./routes/availabilityRoutes"));
const meetingRoutes_1 = __importDefault(require("./routes/meetingRoutes"));
const proposalRoutes_1 = __importDefault(require("./routes/proposalRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
// Ensure uploads folder exists
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/intellimeet';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/availability', availabilityRoutes_1.default);
app.use('/api/meetings', meetingRoutes_1.default);
app.use('/api/proposals', proposalRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
// Enable static serving of Document Uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Database connection
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
