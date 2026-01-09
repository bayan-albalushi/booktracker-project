import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

import userModel from "./models/userModel.js";
import bookModel from "./models/bookModel.js";
import RequestModel from "./models/RequestModel.js";
import favoriteModel from "./models/favoriteModel.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ===============================
// PUBLIC UPLOADS
// ===============================
app.use("/uploads/pdfs", express.static("uploads/pdfs"));
app.use("/uploads/images", express.static("uploads/images"));

// ===============================
// ENSURE UPLOAD FOLDERS
// ===============================
const pdfFolder = path.join(process.cwd(), "uploads/pdfs");
const imgFolder = path.join(process.cwd(), "uploads/images");

if (!fs.existsSync(pdfFolder)) fs.mkdirSync(pdfFolder, { recursive: true });
if (!fs.existsSync(imgFolder)) fs.mkdirSync(imgFolder, { recursive: true });

// ===============================
// MULTER
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, "uploads/pdfs");
    else cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ===============================
// DATABASE
// ===============================
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Database Connected");

// ===============================
// ADMIN LOGIN (Simple – for project scope)
// ===============================
app.post("/adminLogin", async (req, res) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (req.body.email !== ADMIN_EMAIL)
    return res.json({ msg: "Admin not found", login: false });

  if (req.body.password !== ADMIN_PASSWORD)
    return res.json({ msg: "Wrong password", login: false });

  res.json({ msg: "Welcome", login: true });
});

// ===============================
// USER REGISTER
// ===============================
app.post("/userRegister", async (req, res) => {
  try {
    const exist = await userModel.findOne({ userEmail: req.body.userEmail });
    if (exist) return res.json({ msg: "User exists", ok: false });

    const hashed = await bcrypt.hash(req.body.userPassword, 10);

    await userModel.create({
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPassword: hashed,
    });

    res.json({ ok: true, msg: "Registered successfully" });
  } catch {
    res.json({ ok: false, msg: "Server error" });
  }
});

// ===============================
// USER LOGIN
// ===============================
app.post("/userLogin", async (req, res) => {
  const user = await userModel.findOne({ userEmail: req.body.email });
  if (!user) return res.json({ msg: "User not found", login: false });

  const match = await bcrypt.compare(req.body.password, user.userPassword);
  if (!match) return res.json({ msg: "Wrong password", login: false });

  res.json({ msg: "Welcome", login: true, user });
});

// ===============================
// ADD BOOK
// ===============================
app.post(
  "/admin/addBook",
  upload.fields([{ name: "pdfFile" }, { name: "bookImage" }]),
  async (req, res) => {
    const { title, author } = req.body;

    const pdf = req.files?.pdfFile?.[0];
    const img = req.files?.bookImage?.[0];

    if (!pdf) return res.json({ ok: false, msg: "PDF required" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    await bookModel.create({
      title,
      author,
      pdfUrl: `https://booktracker-project.onrender.com/uploads/pdfs/${pdf.filename}`,
      bookImage: img ? `https://booktracker-project.onrender.com/uploads/images/${img.filename}` : "",
    });

    res.json({ ok: true, msg: "Book added" });
  }
);

// ===============================
// GET BOOKS
// ===============================
app.get("/admin/books", async (_, res) => {
  const books = await bookModel.find();
  res.json({ ok: true, books });
});

app.get("/admin/getBook/:id", async (req, res) => {
  const book = await bookModel.findById(req.params.id);
  res.json({ ok: true, book });
});

// ===============================
// UPDATE STATUS
// ===============================
app.put("/user/updateBookStatus/:id", async (req, res) => {
  await bookModel.findByIdAndUpdate(req.params.id, req.body);
  res.json({ ok: true, msg: "Updated" });
});

// ===============================
// FAVORITES
// ===============================
app.post("/user/addFavorite", async (req, res) => {
  const exist = await favoriteModel.findOne(req.body);
  if (exist) return res.json({ ok: false, msg: "Already exists" });

  await favoriteModel.create(req.body);
  res.json({ ok: true, msg: "Added to favorites" });
});

app.get("/user/favorites/:userId", async (req, res) => {
  const data = await favoriteModel.find({ userId: req.params.userId });
  res.json({ ok: true, favorites: data });
});

// ===============================
// REQUESTS
// ===============================
app.post("/user/sendRequest", async (req, res) => {
  await RequestModel.create(req.body);
  res.json({ ok: true, msg: "Request sent" });
});

app.get("/admin/requests", async (_, res) => {
  const requests = await RequestModel.find().sort({ createdAt: -1 });
  res.json({ ok: true, requests });
});

app.delete("/admin/deleteRequest/:id", async (req, res) => {
  await RequestModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ===============================
// USER STATS
// ===============================
app.get("/user/stats/:id", async (req, res) => {
  const userId = req.params.id;

  const total = await bookModel.countDocuments();
  const reading = await bookModel.countDocuments({ readingStatus: "Reading" });
  const completed = await bookModel.countDocuments({ readingStatus: "Completed" });
  const favorites = await favoriteModel.countDocuments({ userId });

  res.json({ ok: true, stats: { total, reading, completed, favorites } });
});

// ===============================
// START SERVER
// ===============================
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
