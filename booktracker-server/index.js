// index.js (booktracker-server)

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

// MODELS
import userModel from "./models/userModel.js";
import bookModel from "./models/bookModel.js";
import RequestModel from "./models/RequestModel.js";
import favoriteModel from "./models/favoriteModel.js";

dotenv.config(); 

const app = express();
app.use(express.json());
app.use(cors());

// PUBLIC FOLDERS
app.use("/uploads/pdfs", express.static("uploads/pdfs"));
app.use("/uploads/images", express.static("uploads/images"));

// ENSURE FOLDERS EXIST
const pdfFolder = path.join(process.cwd(), "uploads/pdfs");
const imgFolder = path.join(process.cwd(), "uploads/images");

if (!fs.existsSync(pdfFolder)) fs.mkdirSync(pdfFolder, { recursive: true });
if (!fs.existsSync(imgFolder)) fs.mkdirSync(imgFolder, { recursive: true });

// MULTER
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

// DATABASE (uses env instead of hard-coded URI)
await mongoose.connect(process.env.MONGO_URI);
console.log("📡 Database Connected!");

// ADMIN LOGIN
app.post("/adminLogin", (req, res) => {
  const ADMIN_EMAIL = "admin@booktracker.com";
  const ADMIN_PASSWORD = "Admin123";

  if (req.body.email !== ADMIN_EMAIL)
    return res.json({ msg: "Admin not found", login: false });

  if (req.body.password !== ADMIN_PASSWORD)
    return res.json({ msg: "Wrong Password", login: false });

  res.json({ msg: "Welcome", login: true, role: "admin" });
});

// USER REGISTER
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

    res.json({ ok: true, msg: "Registered" });
  } catch (err) {
    res.json({ ok: false, msg: "Server Error" });
  }
});

// USER LOGIN
app.post("/userLogin", async (req, res) => {
  try {
    const user = await userModel.findOne({ userEmail: req.body.email });
    if (!user) return res.json({ msg: "User not found", login: false });

    const match = await bcrypt.compare(req.body.password, user.userPassword);
    if (!match) return res.json({ msg: "Wrong Password", login: false });

    res.json({ msg: "Welcome", login: true, user });
  } catch (err) {
    res.json({ msg: "Server Error", login: false });
  }
});

// ADD BOOK
app.post(
  "/admin/addBook",
  upload.fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "bookImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, author } = req.body;

      if (!req.files || !req.files.pdfFile) {
        return res.status(400).json({ ok: false, msg: "PDF required!" });
      }

      const pdfUploaded = req.files.pdfFile?.[0];
      const imgUploaded = req.files.bookImage?.[0];

      const pdfUrl = "http://localhost:7500/uploads/pdfs/" + pdfUploaded.filename;
      const imageUrl = imgUploaded
        ? "http://localhost:7500/uploads/images/" + imgUploaded.filename
        : "";

      await bookModel.create({
        title,
        author,
        pdfUrl,
        bookImage: imageUrl,
      });

      res.json({ ok: true, msg: "Book Added!" });
    } catch (err) {
      res.status(500).json({ ok: false, msg: "Server error" });
    }
  }
);

// UPDATE BOOK
app.put(
  "/admin/updateBook/:id",
  upload.fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "bookImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        author: req.body.author,
      };

      const pdfUploaded = req.files?.pdfFile?.[0];
      const imgUploaded = req.files?.bookImage?.[0];

      if (pdfUploaded)
        updateData.pdfUrl = "http://localhost:7500/uploads/pdfs/" + pdfUploaded.filename;

      if (imgUploaded)
        updateData.bookImage =
          "http://localhost:7500/uploads/images/" + imgUploaded.filename;

      await bookModel.findByIdAndUpdate(req.params.id, updateData);

      res.json({ ok: true, msg: "Book Updated!" });
    } catch (err) {
      res.status(500).json({ ok: false, msg: "Error updating" });
    }
  }
);

// DELETE BOOK
app.delete("/admin/deleteBook/:id", async (req, res) => {
  try {
    await bookModel.findByIdAndDelete(req.params.id);
    res.json({ ok: true, msg: "Book Deleted!" });
  } catch (err) {
    res.status(500).json({ ok: false, msg: "Delete Error" });
  }
});

// GET ALL BOOKS
app.get("/admin/books", async (req, res) => {
  const books = await bookModel.find();
  res.json({ ok: true, books });
});

// GET ONE BOOK
app.get("/admin/getBook/:id", async (req, res) => {
  const book = await bookModel.findById(req.params.id);
  res.json({ ok: true, book });
});

// UPDATE STATUS
app.put("/user/updateBookStatus/:id", async (req, res) => {
  await bookModel.findByIdAndUpdate(req.params.id, {
    readingStatus: req.body.readingStatus,
    rating: req.body.rating,
  });
  res.json({ ok: true, msg: "Updated!" });
});

// SEND REQUEST
app.post("/user/sendRequest", async (req, res) => {
  await RequestModel.create(req.body);
  res.json({ ok: true, msg: "Request submitted!" });
});

// GET REQUESTS
app.get("/admin/requests", async (req, res) => {
  const requests = await RequestModel.find().sort({ createdAt: -1 });
  res.json({ ok: true, requests });
});

// DELETE REQUEST
app.delete("/admin/deleteRequest/:id", async (req, res) => {
  await RequestModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true, msg: "Request deleted!" });
});

// ADD FAVORITE
app.post("/user/addFavorite", async (req, res) => {
  const { userId, bookId } = req.body;
  const exist = await favoriteModel.findOne({ userId, bookId });
  if (exist) return res.json({ ok: false, msg: "Already in favorites" });

  await favoriteModel.create(req.body);

  res.json({ ok: true, msg: "Added to favorites" });
});

// GET FAVORITES
app.get("/user/favorites/:userId", async (req, res) => {
  const data = await favoriteModel.find({ userId: req.params.userId });
  res.json({ ok: true, favorites: data });
});

// START SERVER
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on ${process.env.PORT}`);
});
