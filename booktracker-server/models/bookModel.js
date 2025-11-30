import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    pdfUrl: String,
    bookImage: String,

    readingStatus: { type: String, default: "Reading" },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("books", bookSchema);
