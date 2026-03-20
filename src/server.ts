import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import mongoose from "mongoose";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "./cloudinary";



// -----------------------------
// MONGODB CONNECTION
// -----------------------------
mongoose.connect(process.env.MONGO_URL!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// -----------------------------
// MODELS
// -----------------------------
const sliderSchema = new mongoose.Schema({
  url: String,
  title: String,
});

const trustedSchema = new mongoose.Schema({
  name: String,
  logoUrl: String,
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  location: String,
  image: String,
});

const enquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const settingsSchema = new mongoose.Schema({
  phone: String,
  email: String,
  address: String,
});

const SliderModel = mongoose.model("Slider", sliderSchema);
const TrustedModel = mongoose.model("Trusted", trustedSchema);
const ProjectModel = mongoose.model("Project", projectSchema);
const EnquiryModel = mongoose.model("Enquiry", enquirySchema);
const SettingsModel = mongoose.model("Settings", settingsSchema);

// -----------------------------
// EXPRESS SETUP
// -----------------------------
const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// CLOUDINARY STORAGE
// -----------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "real-estate",
    resource_type: "auto",
  }),
});

const upload = multer({ storage });

// -----------------------------
// AUTH MIDDLEWARE
// -----------------------------
const JWT_SECRET = "SUPER_SECRET_KEY";

function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// -----------------------------
// ADMIN LOGIN
// -----------------------------
const adminUser = {
  username: "admin@property",
  passwordHash: bcrypt.hashSync("Admin@123", 10),
};

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== adminUser.username)
    return res.status(401).json({ message: "Invalid credentials" });

  if (!bcrypt.compareSync(password, adminUser.passwordHash))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// -----------------------------
// PUBLIC GET ROUTES
// -----------------------------
app.get("/api/slider", async (req, res) => {
  res.json(await SliderModel.find());
});

app.get("/api/trusted", async (req, res) => {
  res.json(await TrustedModel.find());
});

app.get("/api/projects", async (req, res) => {
  res.json(await ProjectModel.find());
});

app.get("/api/settings", async (req, res) => {
  const settings = await SettingsModel.findOne();
  res.json(settings);
});

// -----------------------------
// ADMIN: SLIDER UPLOAD + DELETE
// -----------------------------
app.post(
  "/api/slider",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    const file = req.file;
    const { title } = req.body;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const url = file.path; // Cloudinary URL

    const doc = await SliderModel.create({ url, title });
    res.json(doc);
  }
);

app.delete("/api/slider/:id", authMiddleware, async (req, res) => {
  await SliderModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// -----------------------------
// ADMIN: TRUSTED UPLOAD + DELETE
// -----------------------------
app.post(
  "/api/trusted",
  authMiddleware,
  upload.single("logo"),
  async (req, res) => {
    const file = req.file;
    const { name } = req.body;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const logoUrl = file.path; // Cloudinary URL

    const doc = await TrustedModel.create({ name, logoUrl });
    res.json(doc);
  }
);

app.delete("/api/trusted/:id", authMiddleware, async (req, res) => {
  await TrustedModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// -----------------------------
// ADMIN: PROJECT UPLOAD + DELETE
// -----------------------------
app.post(
  "/api/projects",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    const file = req.file;
    const { title, description, price, location } = req.body;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const image = file.path; // Cloudinary URL

    const doc = await ProjectModel.create({
      title,
      description,
      price,
      location,
      image,
    });

    res.json(doc);
  }
);

app.put(
  "/api/projects/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    const file = req.file;
    const { title, description, price, location } = req.body;

    const updateData: any = {
      title,
      description,
      price,
      location,
    };

    if (file) {
      updateData.image = file.path; // Cloudinary URL
    }

    const updated = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  }
);

app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  await ProjectModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// -----------------------------
// CONTACT FORM SUBMISSION
// -----------------------------
app.post("/api/contact", async (req, res) => {
  await EnquiryModel.create(req.body);
  res.json({ success: true });
});

// -----------------------------
// ADMIN: VIEW ENQUIRIES
// -----------------------------
app.get("/api/admin/enquiries", authMiddleware, async (req, res) => {
  const items = await EnquiryModel.find().sort({ createdAt: -1 });
  res.json(items);
});

// DELETE single enquiry
app.delete("/api/admin/enquiries/:id", authMiddleware, async (req, res) => {
  try {
    await EnquiryModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
});

// DELETE multiple enquiries
app.post("/api/admin/enquiries/delete-multiple", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid ids array" });
    }

    await EnquiryModel.deleteMany({ _id: { $in: ids } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete enquiries" });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
