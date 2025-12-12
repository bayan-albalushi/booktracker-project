import { Container } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import bookLogo from "../images/book.png";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const admin = useSelector((state) => state.admin.admin);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      {/* Top Header */}
      <div
        style={{
          backgroundColor: "#A47C78",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Logo + Title */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={bookLogo}
            alt="logo"
            style={{ height: "35px", marginRight: "12px" }}
          />

          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            BOOK TRACKER
          </span>
        </div>

        {/* Logout */}
        <FiLogOut
          size={26}
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        />
      </div>

      {/* MAIN CONTENT */}
      <Container className="text-center mt-5">
        <h3 style={{ fontWeight: "700" }}>Admin Dashboard</h3>

        <p style={{ marginTop: "5px" }}>
          Welcome,&nbsp;
          <b>
            {admin?.adminName ? admin.adminName : "Admin"}
          </b>
        </p>

        {/* BUTTONS */}
        <div
          className="mt-4"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Link
            to="/admin/manageBooks"
            className="btn"
            style={{
              border: "1px solid black",
              backgroundColor: "lightgrey",
              fontWeight: "500",
              borderRadius: "0px",
            }}
          >
            Manage Books
          </Link>

          <Link
            to="/requests"
            className="btn"
            style={{
              border: "1px solid black",
              backgroundColor: "lightgrey",
              fontWeight: "500",
              borderRadius: "0px",
            }}
          >
            View Book Requests
          </Link>

          <Link
            to="/admin/settings"
            className="btn"
            style={{
              border: "1px solid black",
              backgroundColor: "lightgrey",
              fontWeight: "500",
              borderRadius: "0px",
            }}
          >
            Setting
          </Link>
        </div>
      </Container>
    </>
  );
}
