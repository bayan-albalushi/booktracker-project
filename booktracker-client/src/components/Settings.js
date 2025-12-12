// src/pages/Settings.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Settings() {
  const user = useSelector((state) => state.user.user);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE = process.env.REACT_APP_BASE_URL || "http://localhost:7500";

  const handleChangePassword = async () => {
    if (!oldPwd || !newPwd) return alert("Both fields are required");
    setLoading(true);
    try {
      const res = await axios.put(`${BASE}/user/changePassword`, {
        userId: user._id,
        oldPassword: oldPwd,
        newPassword: newPwd,
      });
      alert(res.data.msg || "Updated");
      setOldPwd("");
      setNewPwd("");
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#A47C78", padding: "15px 20px", display: "flex", alignItems: "center" }}>
        <Link to="/user/home" style={{ color: "black", marginRight: 15 }}>
          <FiArrowLeft size={26} />
        </Link>
        <span style={{ fontSize: 24, fontWeight: "bold" }}>BOOK TRACKER</span>
      </div>

      <div className="container mt-4" style={{ maxWidth: 600 }}>
        <h2 style={{ textAlign: "center", fontWeight: 700 }}>Settings</h2>

        <div className="mt-4">
          <label>Old Password</label>
          <input type="password" className="form-control" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />

          <label className="mt-3">New Password</label>
          <input type="password" className="form-control" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />

          <button className="btn w-100 mt-4" style={{ backgroundColor: "#A47C78", color: "black" }} onClick={handleChangePassword} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
}
