import { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import bookLogo from "../images/book.png";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    const res = await axios.get("http://localhost:7500/admin/requests");
    setRequests(res.data.requests);
  };

  const deleteReq = async (id) => {
    await axios.delete(`http://localhost:7500/admin/deleteRequest/${id}`);
    getRequests();
  };

  useEffect(() => {
    getRequests();
  }, []);

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
        <Link to="/admin-dashboard" style={{ color: "black" }}>
          <FiArrowLeft size={26} />
        </Link>

        <img
          src={bookLogo}
          alt="logo"
          style={{ height: "35px", marginLeft: "15px" }}
        />
        <span style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "10px" }}>
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
            style={{ background: "#f5f5f5", borderRadius: "10px" }}
          >

            <h5>User:{req.userEmail}</h5>
            <br></br>



           <p><h5>book name :</h5>{req.bookName}</p> 
            <p><h5>Author: </h5>{req.authorName}</p>
            <p style={{ fontStyle: "italic" }}>{req.message}</p>

            <button
              onClick={() => deleteReq(req._id)}
              className="btn btn-danger btn-sm"
            >
              delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
