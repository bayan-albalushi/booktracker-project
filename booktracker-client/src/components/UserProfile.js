import axios from "axios";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxUser = useSelector((state) => state.user.user);

  const [stats, setStats] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // ✅ احسن: خذ المستخدم من localStorage إذا redux فاضي
  const user =
    reduxUser || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?._id) {
      navigate("/");
      return;
    }

    // ✅ endpoint الصحيح مع id
    axios
      .get(`https://booktracker-project.onrender.com/user/stats/${user._id}`)
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error("STATS ERROR:", err));

    setEditName(user.userName || "");
    setEditEmail(user.userEmail || "");
  }, [user?._id, navigate]); // ✅ dependencies صح

  if (!user) return <h3 className="text-center mt-5">Loading User...</h3>;
  if (!stats) return <h3 className="text-center mt-5">Loading Stats...</h3>;

  // ⚠️ ملاحظة: السيرفر عندك ما فيه /user/updateProfile حاليا
  // إذا ما تبغي تضيفيه في السيرفر، خلي زر Edit فقط UI بدون حفظ
  const updateProfile = async () => {
    alert(
      "Update Profile API is not implemented in server yet. (Need /user/updateProfile endpoint)"
    );
  };

  return (
    <>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#A47C78",
          padding: 15,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link to="/user/home" style={{ color: "black" }}>
          <FiArrowLeft size={26} />
        </Link>

        <span style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          BOOK TRACKER
        </span>
      </div>

      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <h2 className="text-center" style={{ fontWeight: 700 }}>
          User Profile
        </h2>

        <label style={{ fontWeight: 600 }}>User Name</label>
        <input
          disabled
          type="text"
          value={user.userName}
          className="form-control mb-3"
          style={{ borderRadius: "8px" }}
        />

        <label style={{ fontWeight: 600 }}>Email</label>
        <input
          disabled
          type="text"
          value={user.userEmail}
          className="form-control mb-4"
          style={{ borderRadius: "8px" }}
        />

        <button
          className="btn w-100"
          onClick={() => setShowEdit(!showEdit)}
          style={{
            backgroundColor: "#A47C78",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            fontWeight: "600",
          }}
        >
          {showEdit ? "Cancel" : "Edit Profile"}
        </button>

        {showEdit && (
          <div
            className="mt-4 p-3"
            style={{ background: "#f0f0f0", borderRadius: "12px" }}
          >
            <h5 style={{ fontWeight: "700" }}>Update Profile</h5>

            <label style={{ fontWeight: 600 }}>New Name</label>
            <input
              type="text"
              className="form-control mb-3"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <label style={{ fontWeight: 600 }}>New Email</label>
            <input
              type="email"
              className="form-control mb-3"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />

            <button
              className="btn w-100"
              onClick={updateProfile}
              style={{
                backgroundColor: "#A47C78",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                fontWeight: 600,
              }}
            >
              Save Changes
            </button>
          </div>
        )}

        <h5 className="mt-4" style={{ fontWeight: 600 }}>
          Your Book Statistics
        </h5>

        <div className="row text-center mt-3">
          <div className="col-6 p-3">
            <div style={boxStyle}>
              <h4>{stats.total}</h4>
              <p>Total Books</p>
            </div>
          </div>

          <div className="col-6 p-3">
            <div style={boxStyle}>
              <h4>{stats.reading}</h4>
              <p>Currently Reading</p>
            </div>
          </div>

          <div className="col-6 p-3">
            <div style={boxStyle}>
              <h4>{stats.completed}</h4>
              <p>Completed</p>
            </div>
          </div>

          <div className="col-6 p-3">
            <div style={boxStyle}>
              <h4>{stats.favorites}</h4>
              <p>Favorites</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const boxStyle = {
  backgroundColor: "#E5E5E5",
  padding: "20px 0",
  borderRadius: "8px",
};
