import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Settings() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // BASE URL (Render أو Local)
  // ===============================
  const BASE_URL =
    process.env.REACT_APP_BASE_URL || "https://booktracker-project.onrender.com";

  // ===============================
  // AUTH GUARD
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token || !user) {
      navigate("/");
    }
  }, [navigate, user]);

  // ===============================
  // CHANGE PASSWORD
  // ===============================
  const handleChangePassword = async () => {
    if (!oldPwd || !newPwd)
      return alert("Both fields are required");

    try {
      setLoading(true);

      const token = localStorage.getItem("userToken");

      const res = await axios.put(
      "https://booktracker-project.onrender.com/user/changePassword",
        {
          oldPassword: oldPwd,
          newPassword: newPwd,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.msg || "Password updated");
      setOldPwd("");
      setNewPwd("");
    } catch (err) {
      console.error("Change password error:", err);
      alert(
        err.response?.data?.msg || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
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
        <Link to="/user/home" style={{ color: "black", marginRight: 15 }}>
          <FiArrowLeft size={26} />
        </Link>

        <span style={{ fontSize: 24, fontWeight: "bold" }}>
          BOOK TRACKER
        </span>
      </div>

      {/* CONTENT */}
      <div className="container mt-4" style={{ maxWidth: 600 }}>
        <h2
          style={{
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Settings
        </h2>

        <div className="mt-4">
          <label>Old Password</label>
          <input
            type="password"
            className="form-control"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />

          <label className="mt-3">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />

          <button
            className="btn w-100 mt-4"
            style={{
              backgroundColor: "#A47C78",
              color: "black",
              fontWeight: "bold",
            }}
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
}
