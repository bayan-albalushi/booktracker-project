import { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import bookLogo from "../images/book.png";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // ===============================
  // BASE URL (Render أو Local)
  // ===============================
  const BASE_URL =
    process.env.REACT_APP_BASE_URL || "https://booktracker-project.onrender.com";

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
  // GET REQUESTS
  // ===============================
  const getRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/requests`, {
        headers: getAuthHeader(),
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  // ===============================
  // DELETE REQUEST
  // ===============================
  const deleteReq = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}/admin/deleteRequest/${id}`,
        {
          headers: getAuthHeader(),
        }
      );
      getRequests();
    } catch (err) {
      console.error("Delete request failed", err);
      alert("Failed to delete request");
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

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
        <Link to="/admin-dashboard" style={{ color: "black" }}>
          <FiArrowLeft size={26} />
        </Link>

        <img
          src={bookLogo}
          alt="logo"
          style={{ height: "35px", marginLeft: "15px" }}
        />

        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          BOOK TRACKER
        </span>
      </div>

      <h2 className="text-center mt-4">Requests Page</h2>

      <div className="container mt-4">
        {requests.length === 0 && (
          <p className="text-center">No requests yet!</p>
        )}

        {requests.map((req) => (
          <div
            key={req._id}
            className="p-3 mb-3"
            style={{
              background: "#f5f5f5",
              borderRadius: "10px",
            }}
          >
            <h5>User: {req.userEmail}</h5>
            <br />

            <p>
              <strong>Book Name:</strong> {req.bookName}
            </p>

            <p>
              <strong>Author:</strong> {req.authorName}
            </p>

            {req.message && (
              <p style={{ fontStyle: "italic" }}>{req.message}</p>
            )}

            <button
              onClick={() => deleteReq(req._id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
