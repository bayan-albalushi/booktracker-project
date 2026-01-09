import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bookLogo from "../images/book.png";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  

  // ===============================
  // GET FAVORITES
  // ===============================
  const getFavorites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("userToken");

      if (!user || !token) {
        navigate("/");
        return;
      }

      const res = await axios.get(
        `https://booktracker-project.onrender.com/user/favorites/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(res.data.favorites || []);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  useEffect(() => {
    getFavorites();
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
        <Link to="/user/home" style={{ color: "black", marginRight: "15px" }}>
          <FiArrowLeft size={26} />
        </Link>

        <img
          src={bookLogo}
          alt="logo"
          style={{ height: "35px", marginRight: "10px" }}
        />

        <span style={{ fontSize: "22px", fontWeight: "bold" }}>
          BOOK TRACKER
        </span>
      </div>

      <h2 className="text-center mt-3" style={{ fontWeight: "700" }}>
        My Favorite Books
      </h2>

      <div className="container mt-4">
        {favorites.length === 0 && (
          <p className="text-center">No favorite books yet</p>
        )}

        {favorites.map((fav) => (
          <div
            key={fav._id}
            onClick={() => navigate(`/books/${fav.bookId}`)}
            style={{
              backgroundColor: "#E8E8E8",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
          >
            <img
              src={fav.image}
              alt="book"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <h5 className="mt-3">{fav.title}</h5>
            <p className="mb-1">{fav.author}</p>

            <div style={{ fontSize: "20px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color: star <= fav.rating ? "#A47C78" : "#ccc",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
