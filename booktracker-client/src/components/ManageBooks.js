import { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ManageBooks() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [bookImage, setBookImage] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const BASE_URL = "http://localhost:7500";

  const getBooks = async () => {
    const res = await axios.get(`${BASE_URL}/admin/books`);
    setBooks(res.data.books);
  };

  useEffect(() => {
    getBooks();
  }, []);

  const addBook = async () => {
    if (!title || !author || !pdfFile || !bookImage)
      return alert("Fill all fields");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("pdfFile", pdfFile);
    formData.append("bookImage", bookImage);

    await axios.post(`${BASE_URL}/admin/addBook`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Book Added!");
    getBooks();
  };

  const updateBook = async () => {
    if (!selectedId) return alert("Select a book first");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    if (pdfFile) formData.append("pdfFile", pdfFile);
    if (bookImage) formData.append("bookImage", bookImage);

    await axios.put(`${BASE_URL}/admin/updateBook/${selectedId}`, formData);

    alert("Updated!");
    getBooks();
  };

  const deleteBook = async () => {
    if (!selectedId) return alert("Select a book first");

    await axios.delete(`${BASE_URL}/admin/deleteBook/${selectedId}`);

    alert("Deleted!");
    getBooks();
    setSelectedId("");
    setTitle("");
    setAuthor("");
    setPdfFile(null);
    setBookImage(null);
  };

  const fillForm = (book) => {
    setSelectedId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setPdfFile(null);
    setBookImage(null);
  };

  return (
    <>
      <div style={{ backgroundColor: "#A47C78", padding: 15, display: "flex" }}>
        <Link to="/admin-dashboard" style={{ color: "black" }}>
          <FiArrowLeft size={26} />
        </Link>
        <span style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          BOOK TRACKER
        </span>
      </div>

      <Container className="mt-4">
        <h3 className="text-center">Manage Books</h3>

        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <label>Title:</label>
          <input
            className="form-control mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Author:</label>
          <input
            className="form-control mb-3"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label>Book PDF:</label>
          <input
            type="file"
            className="form-control mb-3"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />

          <label>Book Image:</label>
          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) => setBookImage(e.target.files[0])}
          />

          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-4">
            <button
              style={{
                backgroundColor: "#A47C78",
                color: "black",
                width: "30%",
                borderRadius: "8px",
                border: "none",
                padding: "8px 0",
              }}
              onClick={addBook}
            >
              Add Book
            </button>

            <button
              style={{
                backgroundColor: "#A47C78",
                color: "black",
                width: "30%",
                borderRadius: "8px",
                border: "none",
                padding: "8px 0",
              }}
              onClick={updateBook}
            >
              Update Book
            </button>

            <button
              style={{
                backgroundColor: "#A47C78",
                color: "black",
                width: "30%",
                borderRadius: "8px",
                border: "none",
                padding: "8px 0",
              }}
              onClick={deleteBook}
            >
              Delete
            </button>
          </div>
        </div>

        {/* ====== DISPLAY BOOKS WITH IMAGE + PDF ====== */}
        <h4 className="mt-5">Books List:</h4>

        <div className="row">
          {books.map((book) => (
            <div key={book._id} className="col-4 mb-4">
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={() => fillForm(book)}
              >
                <img
                  src={book.bookImage}
                  alt="book"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />

                <h6 style={{ margin: 0 }}>{book.title}</h6>
                <p style={{ margin: 0 }}>by {book.author}</p>

                <a
                  href={book.pdfUrl}
                  target="_blank"
                  style={{ fontSize: "14px", color: "#A47C78" }}
                  rel="noreferrer"
                >
                  📄 View PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
