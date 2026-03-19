import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/realestate";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

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

export const SliderModel = mongoose.model("Slider", sliderSchema);
export const TrustedModel = mongoose.model("Trusted", trustedSchema);
export const ProjectModel = mongoose.model("Project", projectSchema);

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

export const EnquiryModel = mongoose.model("Enquiry", enquirySchema);
export const SettingsModel = mongoose.model("Settings", settingsSchema);

