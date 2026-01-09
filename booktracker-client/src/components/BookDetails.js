import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

export default function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [readingStatus, setReadingStatus] = useState("Reading");

  

  // ===============================
  // GET BOOK
  // ===============================
  const getBook = async () => {
    try {
      const res = await axios.get(`https://booktracker-project.onrender.com/admin/getBook/${id}`);

      setBook(res.data.book);
      setRating(res.data.book.rating || 0);
      setReadingStatus(res.data.book.readingStatus || "Reading");
    } catch (err) {
      console.error("Failed to fetch book", err);
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  if (!book) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#A47C78",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link to="/books" style={{ color: "black", marginRight: "15px" }}>
          <FiArrowLeft size={26} />
        </Link>

        <span style={{ fontSize: "24px", fontWeight: "bold" }}>
          BOOK TRACKER
        </span>
      </div>

      <h2 className="text-center mt-4">{book.title}</h2>

      <div className="container mt-4">
        {/* BOOK IMAGE */}
        <img
          src={book.bookImage}
          alt="book"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <p className="text-center mt-3">{book.author}</p>

        {/* READING STATUS */}
        <select
          className="form-select"
          value={readingStatus}
          onChange={(e) => setReadingStatus(e.target.value)}
        >
          <option>Reading</option>
          <option>Completed</option>
          <option>Plan to read</option>
        </select>

        {/* RATING */}
        <div className="mt-3 text-center" style={{ fontSize: "25px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#8a5954ed" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* ADD TO FAVORITE */}
        <button
          onClick={async () => {
            try {
              const user = JSON.parse(localStorage.getItem("user"));

              if (!user) {
                alert("Please login first");
                return;
              }

              const res = await axios.post(
                "https://booktracker-project.onrender.com/user/addFavorite",
                {
                  userId: user._id,
                  bookId: book._id,
                  title: book.title,
                  author: book.author,
                  image: book.bookImage,
                  rating,
                }
              );

              alert(res.data.msg);
            } catch (err) {
              console.error("Add favorite failed", err);
              alert("Failed to add favorite");
            }
          }}
          style={{
            backgroundColor: "#A47C78",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            marginTop: "15px",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Add to Favorite
        </button>

        {/* SAVE STATUS */}
        <button
          className="btn w-100 mt-3"
          style={{ backgroundColor: "#A47C78", color: "white" }}
          onClick={async () => {
            try {
              await axios.put(
                `https://booktracker-project.onrender.com/user/updateBookStatus/${id}`,
                {
                  rating,
                  readingStatus,
                }
              );

              alert("Saved!");
            } catch (err) {
              console.error("Save failed", err);
              alert("Failed to save");
            }
          }}
        >
          Save
        </button>

        {/* PDF */}
        <h4 className="mt-4">Book PDF</h4>

        <iframe
          src={book.pdfUrl}
          width="100%"
          height="500"
          style={{ border: "none" }}
          title="pdf"
        ></iframe>
      </div>
    </>
  );
}
