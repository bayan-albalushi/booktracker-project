import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AdminSettings() {
  // Admin static data (يمكن لاحقًا ربطه بقاعدة بيانات)
  const adminEmail = "admin@booktracker.com";

  const [email, setEmail] = useState(adminEmail);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  const handlePasswordChange = () => {
    if (!newPassword) return alert("Please enter new password");
    alert("Password updated successfully!");
    setNewPassword("");
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

        {/* ADMIN EMAIL (read only) */}
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

        {/* CHANGE PASSWORD SECTION */}
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
          style={{
            backgroundColor: "#A47C78",
            color: "white",
            borderRadius: 8,
            padding: 10,
            fontWeight: 600,
          }}
        >
          Change Password
        </button>

        {/* SAVE SETTINGS BUTTON */}
        <button
          className="btn w-100 mt-4"
          onClick={handleSave}
          style={{
            backgroundColor: "#C1A09A",
            color: "white",
            borderRadius: 8,
            padding: 10,
            fontWeight: 600,
          }}
        >
          Save Settings
        </button>
      </div>
    </>
  );
}
