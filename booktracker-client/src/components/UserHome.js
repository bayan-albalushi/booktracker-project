import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import bookLogo from "../images/book.png";
import { FiLogOut } from "react-icons/fi";

export default function UserHome() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===============================
  // AUTH GUARD (FIXED)
  // ===============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedUser && !storedEmail) {
      navigate("/");
    }
  }, [navigate]);

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");

    dispatch({ type: "user/logout" });
    navigate("/");
  };

  // ===============================
  // PREVENT CRASH (LIVE SAFE)
  // ===============================
  if (!user && !localStorage.getItem("user")) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <>
      {/* TOP HEADER */}
      <div
        style={{
          backgroundColor: "#A47C78",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
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

        <FiLogOut
          size={26}
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        />
      </div>

      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "35px",
          padding: "12px 0",
          backgroundColor: "#f2f2f2",
          fontWeight: "500",
        }}
      >
        <Link to="/user/aboutBooks" className="text-dark text-decoration-none">
          About Books
        </Link>

        <Link to="/user-profile" className="text-dark text-decoration-none">
          User Profile
        </Link>

        <Link to="/user/favorites" className="text-dark text-decoration-none">
          Favorites
        </Link>

        <Link
          to="/user/NearbyBookStores"
          className="text-dark text-decoration-none"
        >
          Book Stores
        </Link>

        <Link to="/user/Settings" className="text-dark text-decoration-none">
          Settings
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <Container className="text-center mt-5">
        <Row>
          <Col>
            <h1 style={{ fontWeight: "700", fontSize: "38px" }}>
              Welcome to
            </h1>
            <h1 style={{ fontWeight: "700", fontSize: "38px" }}>
              Book Tracker!
            </h1>

            <p
              className="mt-4"
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                maxWidth: "420px",
                margin: "0 auto",
              }}
            >
              Manage your reading, track your progress and explore nearby
              bookstores.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
