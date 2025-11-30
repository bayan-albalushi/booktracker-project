import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  title: String,
  author: String,
  image: String,
  rating: Number,
});

export default mongoose.model("favorite", favoriteSchema);
