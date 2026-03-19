"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = exports.EnquiryModel = exports.ProjectModel = exports.TrustedModel = exports.SliderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = "mongodb://127.0.0.1:27017/realestate";
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error", err));
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
exports.SliderModel = mongoose_1.default.model("Slider", sliderSchema);
exports.TrustedModel = mongoose_1.default.model("Trusted", trustedSchema);
exports.ProjectModel = mongoose_1.default.model("Project", projectSchema);
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
exports.EnquiryModel = mongoose_1.default.model("Enquiry", enquirySchema);
exports.SettingsModel = mongoose_1.default.model("Settings", settingsSchema);
