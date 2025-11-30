import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [readingStatus, setReadingStatus] = useState("Reading");

  const BASE_URL = "http://localhost:7500";

  const getBook = async () => {
    const res = await axios.get(`${BASE_URL}/admin/getBook/${id}`);
    setBook(res.data.book);

    setRating(res.data.book.rating);
    setReadingStatus(res.data.book.readingStatus);
  };

  useEffect(() => {
    getBook();
  }, []);

  if (!book) return <h3>Loading...</h3>;

  return (
    <>
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
        <img
          src={book.bookImage}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
          alt=""
        />

        <p className="text-center mt-3">{book.author}</p>

        <select
          className="form-select"
          value={readingStatus}
          onChange={(e) => setReadingStatus(e.target.value)}
        >
          <option>Reading</option>
          <option>Completed</option>
          <option>Plan to read</option>
        </select>

        <div className="mt-3" style={{ fontSize: "25px" }}>
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

       <button
  onClick={async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.post("http://localhost:7500/user/addFavorite", {
      userId: user._id,
      bookId: book._id,
      title: book.title,
      author: book.author,
      image: book.bookImage,
      rating,
    });

    alert(res.data.msg);
  }}
  style={{
    backgroundColor: "#A47C78",
    color: "white",
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    marginTop: "15px",
    fontWeight: "bold",
  }}
>
  add to favorite
</button>



        <button
          className="btn w-100 mt-3"
          style={{ backgroundColor: "#A47C78", color: "white" }}
          onClick={async () => {
            await axios.put(`${BASE_URL}/user/updateBookStatus/${id}`, {
              rating,
              readingStatus,
            });
            alert("Saved!");
          }}
        >
          Save
        </button>

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
