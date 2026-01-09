import { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageBooks() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [bookImage, setBookImage] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  

  // ===============================
  // AUTH HEADER
  // ===============================
  const getAuthHeader = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ===============================
  // READ BOOKS
  // ===============================
  const getBooks = async () => {
    try {
      const res = await axios.get( "https://booktracker-project.onrender.com/admin/books", {
        headers: getAuthHeader(),
      });
      setBooks(res.data.books);
    } catch (err) {
      console.error("Fetch books failed", err);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  // ===============================
  // ADD BOOK
  // ===============================
  const addBook = async () => {
    if (!title || !author || !pdfFile || !bookImage)
      return alert("Fill all fields");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("pdfFile", pdfFile);
      formData.append("bookImage", bookImage);

      await axios.post("https://booktracker-project.onrender.com/admin/addBook", formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Book Added!");
      resetForm();
      getBooks();
    } catch (err) {
      console.error("Add book failed", err);
      alert("Failed to add book");
    }
  };

  // ===============================
  // UPDATE BOOK
  // ===============================
  const updateBook = async () => {
    if (!selectedId) return alert("Select a book first");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      if (pdfFile) formData.append("pdfFile", pdfFile);
      if (bookImage) formData.append("bookImage", bookImage);

      await axios.put(
        `https://booktracker-project.onrender.com/admin/updateBook/${selectedId}`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Updated!");
      resetForm();
      getBooks();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update book");
    }
  };

  // ===============================
  // DELETE BOOK
  // ===============================
  const deleteBook = async () => {
    if (!selectedId) return alert("Select a book first");

    try {
      await axios.delete(`https://booktracker-project.onrender.com/admin/deleteBook/${selectedId}`, {
        headers: getAuthHeader(),
      });

      alert("Deleted!");
      resetForm();
      getBooks();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete book");
    }
  };

  // ===============================
  // HELPERS
  // ===============================
  const fillForm = (book) => {
    setSelectedId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setPdfFile(null);
    setBookImage(null);
  };

  const resetForm = () => {
    setSelectedId("");
    setTitle("");
    setAuthor("");
    setPdfFile(null);
    setBookImage(null);
  };

  return (
    <>
      {/* HEADER */}
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

        {/* FORM */}
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
              style={btnStyle}
              onClick={addBook}
            >
              Add Book
            </button>

            <button
              style={btnStyle}
              onClick={updateBook}
            >
              Update Book
            </button>

            <button
              style={btnStyle}
              onClick={deleteBook}
            >
              Delete
            </button>
          </div>
        </div>

        {/* BOOK LIST */}
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
                  rel="noreferrer"
                  style={{ fontSize: "14px", color: "#A47C78" }}
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

// ===============================
// BUTTON STYLE
// ===============================
const btnStyle = {
  backgroundColor: "#A47C78",
  color: "black",
  width: "30%",
  borderRadius: "8px",
  border: "none",
  padding: "8px 0",
};
