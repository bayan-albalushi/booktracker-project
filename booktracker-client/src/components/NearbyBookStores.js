import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function NearbyBookStores() {
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // 📌 Get user real location (Location-Based Service)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }, []);

  const stores = [
    { name: "Seeb Library", area: "seeb", lat: 23.66794, lon: 58.18266 },
    { name: "Al Maabilah Bookstore", area: "maabilah", lat: 23.61095, lon: 58.21377 },
    { name: "Al Hail Bookshop", area: "hail", lat: 23.60085, lon: 58.29044 },
    { name: "Oman Bookshop – Mawaleh", area: "mawaleh", lat: 23.58572, lon: 58.22411 },
    { name: "Al Manhal Bookstore – Al Khoudh", area: "khoudh", lat: 23.66953, lon: 58.18058 },
  ];

  const filteredStores = stores.filter((store) =>
    store.area.toLowerCase().includes(query.toLowerCase())
  );

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
        <span style={{ fontSize: 24, fontWeight: "bold" }}>BOOK TRACKER</span>
      </div>

      <div className="container mt-4" style={{ maxWidth: 700 }}>
        <h2 className="text-center" style={{ fontWeight: 700 }}>
          Nearby Book Stores 📍
        </h2>

        {/* Show user location status */}
        <p className="text-center" style={{ fontSize: 13, color: "gray" }}>
          {userLocation
            ? "📍 Your location detected successfully"
            : "📍 Detecting your location..."}
        </p>

        {/* SEARCH BOX */}
        <input
          type="text"
          placeholder="Enter area (Seeb, Maabilah, Hail...)"
          className="form-control"
          style={{ borderRadius: 8 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <hr className="mt-4" />

        {query && filteredStores.length === 0 && (
          <p className="text-center" style={{ color: "gray" }}>
            No bookstores found for this location.
          </p>
        )}

        {/* BOOKSTORE LIST */}
        {filteredStores.map((store, i) => (
          <div key={i}>
            <div
              style={{
                padding: "10px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <FiMapPin size={22} style={{ marginRight: 12 }} />
                <div>
                  <h6 style={{ margin: 0 }}>{store.name}</h6>
                  <p style={{ fontSize: 13, margin: 0, color: "#666" }}>
                    {store.area.toUpperCase()}
                  </p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps?q=${store.lat},${store.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#A47C78",
                  color: "white",
                  padding: "6px 12px",
                  fontSize: 12,
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                View Map
              </a>
            </div>

            <hr />
          </div>
        ))}
      </div>
    </>
  );
}
