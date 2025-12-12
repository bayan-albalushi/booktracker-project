import { useEffect, useState } from "react";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bookLogo from "../images/book.png";

export default function AboutBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  // Request Form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const getBooks = async () => {
    const res = await axios.get("http://localhost:7500/admin/books");
    setBooks(res.data.books);
  };

  useEffect(() => {
    getBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  // ⭐ FIXED — send request using userId from localStorage
  const sendRequest = async () => {
    if (!bookName || !authorName)
      return alert("Please fill book name and author name");

    // نجيب بيانات اليوزر
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("User not logged in");
      return;
    }

    await axios.post("http://localhost:7500/user/sendRequest", {
      userId: user._id,
      bookName,
      authorName,
      message,
    });

    alert("Request Sent!");
    setBookName("");
    setAuthorName("");
    setMessage("");
    setShowRequestForm(false);
  };

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
        <Link to="/user/home" style={{ color: "black", marginRight: "15px" }}>
          <FiArrowLeft size={26} />
        </Link>

        <img
          src={bookLogo}
          alt="logo"
          style={{ height: "35px", marginRight: "12px" }}
        />

        <span style={{ fontSize: "24px", fontWeight: "bold" }}>
          BOOK TRACKER
        </span>
      </div>

      {/* SEARCH BAR */}
      <div className="d-flex justify-content-center mt-3">
        <div
          style={{
            display: "flex",
            backgroundColor: "#f2f2f2",
            padding: "10px 15px",
            borderRadius: "10px",
            alignItems: "center",
            width: "75%",
            maxWidth: "400px",
          }}
        >
          <FiSearch size={20} style={{ marginRight: "10px", opacity: 0.6 }} />
          <input
            type="text"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "15px",
            }}
          />
        </div>
      </div>

      {/* page title */}
      <h2 className="text-center mt-3" style={{ fontWeight: "700" }}>
        About Books
      </h2>

      {/* book grid */}
      <div className="container mt-4">
        <div className="row">
          {filteredBooks.map((book) => (
            <div key={book._id} className="col-6 mb-4">
              <div
                style={{
                  backgroundColor: "#E8E8E8",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={book.bookImage}
                  alt="book"
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "10px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>{book.title}</span>

                  <span
                    style={{ fontSize: "12px", cursor: "pointer" }}
                    onClick={() => navigate(`/books/${book._id}`)}
                  >
                    view more
                  </span>
                </div>

                <p style={{ margin: 0 }}>{book.author}</p>

                <select
                  disabled
                  className="form-select mt-2"
                  style={{ fontSize: "14px" }}
                >
                  <option>{book.readingStatus}</option>
                </select>

                <div style={{ fontSize: "18px", marginTop: "5px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        color:
                          star <= (book.rating || 0) ? "#A47C78" : "lightgray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* request button */}
        <div className="text-center mt-4">
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            style={{
              backgroundColor: "#A47C78",
              color: "black",
              padding: "10px 30px",
              borderRadius: "18px",
              border: "none",
              fontWeight: "600",
            }}
          >
            give request for a book
          </button>
        </div>

        {/* request form */}
        {showRequestForm && (
          <div className="text-center mt-4 mb-5">
            <input
              type="text"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              style={{
                width: "75%",
                maxWidth: "400px",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />

            <input
              type="text"
              placeholder="Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              style={{
                width: "75%",
                maxWidth: "400px",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />

            <textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "75%",
                maxWidth: "400px",
                height: "80px",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            ></textarea>

            <br />

            <button
              onClick={sendRequest}
              style={{
                marginTop: "10px",
                backgroundColor: "#A47C78",
                color: "black",
                padding: "8px 25px",
                borderRadius: "18px",
                border: "none",
                fontWeight: "600",
              }}
            >
              Send Request
            </button>
          </div>
        )}
      </div>
    </>
  );
}
