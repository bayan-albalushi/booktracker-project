import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminSettings() {
  const navigate = useNavigate();

  // ===============================
  // BASE URL (Render أو Local)
  // ===============================
  const BASE_URL =
    process.env.REACT_APP_BASE_URL || "https://booktracker-project.onrender.com";

  // ===============================
  // STATES
  // ===============================
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH ADMIN DATA
  // ===============================
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(`${BASE_URL}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmail(res.data.admin.email);
      } catch (err) {
        console.error("Failed to load admin data", err);
        navigate("/");
      }
    };

    fetchAdmin();
  }, [navigate, BASE_URL]);

  // ===============================
  // UPDATE EMAIL
  // ===============================
  const handleSave = async () => {
    if (!newEmail) {
      alert("Please enter new email");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${BASE_URL}/admin/update-email`,
        { email: newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmail(newEmail);
      setNewEmail("");
      alert("Email updated successfully!");
    } catch (err) {
      console.error("Email update failed", err);
      alert("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UPDATE PASSWORD
  // ===============================
  const handlePasswordChange = async () => {
    if (!newPassword) {
      alert("Please enter new password");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${BASE_URL}/admin/update-password`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewPassword("");
      alert("Password updated successfully!");
    } catch (err) {
      console.error("Password update failed", err);
      alert("Failed to update password");
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
        <Link to="/admin-dashboard" style={{ color: "black", marginRight: 15 }}>
          <FiArrowLeft size={26} />
        </Link>

        <span style={{ fontSize: 24, fontWeight: "bold", color: "black" }}>
          BOOK TRACKER
        </span>
      </div>

      {/* CONTENT */}
      <div className="container mt-4" style={{ maxWidth: 600 }}>
        <h2 className="text-center" style={{ fontWeight: 700 }}>
          Admin Settings
        </h2>

        {/* ADMIN EMAIL */}
        <label className="mt-3" style={{ fontWeight: 600 }}>
          Admin Email
        </label>
        <input
          type="text"
          disabled
          value={email}
          className="form-control"
          style={{ borderRadius: 8 }}
        />

        {/* CHANGE EMAIL */}
        <label className="mt-4" style={{ fontWeight: 600 }}>
          Change Admin Email
        </label>
        <input
          type="email"
          placeholder="Enter new email"
          value={newEmail}
          className="form-control"
          onChange={(e) => setNewEmail(e.target.value)}
          style={{ borderRadius: 8 }}
        />

        {/* CHANGE PASSWORD */}
        <hr className="mt-4" />

        <h5 className="text-center" style={{ fontWeight: 700 }}>
          Change Password
        </h5>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          className="form-control mt-2"
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ borderRadius: 8 }}
        />

        <button
          className="btn w-100 mt-3"
          onClick={handlePasswordChange}
          disabled={loading}
          style={{
            backgroundColor: "#A47C78",
            color: "white",
            borderRadius: 8,
            padding: 10,
            fontWeight: 600,
          }}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

        {/* SAVE SETTINGS */}
        <button
          className="btn w-100 mt-4"
          onClick={handleSave}
          disabled={loading}
          style={{
            backgroundColor: "#C1A09A",
            color: "white",
            borderRadius: 8,
            padding: 10,
            fontWeight: 600,
          }}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </>
  );
}
