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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = __importDefault(require("./cloudinary"));
// -----------------------------
// MONGODB CONNECTION
// -----------------------------
mongoose_1.default.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));
// -----------------------------
// MODELS
// -----------------------------
const sliderSchema = new mongoose_1.default.Schema({
    url: String,
    title: String,
});
const trustedSchema = new mongoose_1.default.Schema({
    name: String,
    logoUrl: String,
});
const projectSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: String,
    location: String,
    image: String,
});
const enquirySchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
});
const settingsSchema = new mongoose_1.default.Schema({
    phone: String,
    email: String,
    address: String,
});
const SliderModel = mongoose_1.default.model("Slider", sliderSchema);
const TrustedModel = mongoose_1.default.model("Trusted", trustedSchema);
const ProjectModel = mongoose_1.default.model("Project", projectSchema);
const EnquiryModel = mongoose_1.default.model("Enquiry", enquirySchema);
const SettingsModel = mongoose_1.default.model("Settings", settingsSchema);
// -----------------------------
// EXPRESS SETUP
// -----------------------------
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// -----------------------------
// CLOUDINARY STORAGE
// -----------------------------
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            folder: "real-estate",
            resource_type: "auto",
        });
    }),
});
const upload = (0, multer_1.default)({ storage });
// -----------------------------
// AUTH MIDDLEWARE
// -----------------------------
const JWT_SECRET = "SUPER_SECRET_KEY";
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });
    const token = header.split(" ")[1];
    try {
        req.user = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch (_a) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
// -----------------------------
// ADMIN LOGIN
// -----------------------------
const adminUser = {
    username: "admin@property",
    passwordHash: bcryptjs_1.default.hashSync("Admin@123", 10),
};
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username !== adminUser.username)
        return res.status(401).json({ message: "Invalid credentials" });
    if (!bcryptjs_1.default.compareSync(password, adminUser.passwordHash))
        return res.status(401).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
});
// -----------------------------
// PUBLIC GET ROUTES
// -----------------------------
app.get("/api/slider", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield SliderModel.find());
}));
app.get("/api/trusted", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield TrustedModel.find());
}));
app.get("/api/projects", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield ProjectModel.find());
}));
app.get("/api/settings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield SettingsModel.findOne();
    res.json(settings);
}));
// -----------------------------
// ADMIN: SLIDER UPLOAD + DELETE
// -----------------------------
app.post("/api/slider", authMiddleware, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { title } = req.body;
    if (!file)
        return res.status(400).json({ message: "No file uploaded" });
    const url = file.path; // Cloudinary URL
    const doc = yield SliderModel.create({ url, title });
    res.json(doc);
}));
app.delete("/api/slider/:id", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield SliderModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
}));
// -----------------------------
// ADMIN: TRUSTED UPLOAD + DELETE
// -----------------------------
app.post("/api/trusted", authMiddleware, upload.single("logo"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { name } = req.body;
    if (!file)
        return res.status(400).json({ message: "No file uploaded" });
    const logoUrl = file.path; // Cloudinary URL
    const doc = yield TrustedModel.create({ name, logoUrl });
    res.json(doc);
}));
app.delete("/api/trusted/:id", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield TrustedModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
}));
// -----------------------------
// ADMIN: PROJECT UPLOAD + DELETE
// -----------------------------
app.post("/api/projects", authMiddleware, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { title, description, price, location } = req.body;
    if (!file)
        return res.status(400).json({ message: "No file uploaded" });
    const image = file.path; // Cloudinary URL
    const doc = yield ProjectModel.create({
        title,
        description,
        price,
        location,
        image,
    });
    res.json(doc);
}));
app.put("/api/projects/:id", authMiddleware, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { title, description, price, location } = req.body;
    const updateData = {
        title,
        description,
        price,
        location,
    };
    if (file) {
        updateData.image = file.path; // Cloudinary URL
    }
    const updated = yield ProjectModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
}));
app.delete("/api/projects/:id", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield ProjectModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
}));
// -----------------------------
// CONTACT FORM SUBMISSION
// -----------------------------
app.post("/api/contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield EnquiryModel.create(req.body);
    res.json({ success: true });
}));
// -----------------------------
// ADMIN: VIEW ENQUIRIES
// -----------------------------
app.get("/api/admin/enquiries", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield EnquiryModel.find().sort({ createdAt: -1 });
    res.json(items);
}));
// DELETE single enquiry
app.delete("/api/admin/enquiries/:id", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield EnquiryModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete enquiry" });
    }
}));
// DELETE multiple enquiries
app.post("/api/admin/enquiries/delete-multiple", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: "Invalid ids array" });
        }
        yield EnquiryModel.deleteMany({ _id: { $in: ids } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete enquiries" });
    }
}));
// -----------------------------
// START SERVER
// -----------------------------
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
