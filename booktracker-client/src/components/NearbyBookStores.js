import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function NearbyBookStores() {
  const navigate = useNavigate();

  // ===============================
  // STATE
  // ===============================
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // ===============================
  // AUTH GUARD (اختياري لكن مهم)
  // ===============================
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/");
  }, [navigate]);

  // ===============================
  // GET USER LOCATION
  // ===============================
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setLocationError("Location permission denied");
      }
    );
  }, []);

  // ===============================
  // STATIC BOOKSTORES DATA
  // ===============================
  const stores = [
    { name: "Seeb Library", area: "seeb", lat: 23.66794, lon: 58.18266 },
    { name: "Al Maabilah Bookstore", area: "maabilah", lat: 23.61095, lon: 58.21377 },
    { name: "Al Hail Bookshop", area: "hail", lat: 23.60085, lon: 58.29044 },
    { name: "Oman Bookshop – Mawaleh", area: "mawaleh", lat: 23.58572, lon: 58.22411 },
    { name: "Al Manhal Bookstore – Al Khoudh", area: "khoudh", lat: 23.66953, lon: 58.18058 },
  ];

  // ===============================
  // DISTANCE CALCULATION (KM)
  // ===============================
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // ===============================
  // SORT BY NEAREST
  // ===============================
  const sortedStores = userLocation
    ? stores
        .map((store) => ({
          ...store,
          distance: getDistance(
            userLocation.lat,
            userLocation.lon,
            store.lat,
            store.lon
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
    : stores;

  // ===============================
  // SEARCH FILTER
  // ===============================
  const finalStores = sortedStores.filter((store) =>
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
        <span style={{ fontSize: 24, fontWeight: "bold" }}>
          BOOK TRACKER
        </span>
      </div>

      <div className="container mt-4" style={{ maxWidth: 700 }}>
        <h2 className="text-center" style={{ fontWeight: 700 }}>
          Nearby Book Stores 📍
        </h2>

        {/* LOCATION STATUS */}
        <p className="text-center" style={{ fontSize: 13, color: "gray" }}>
          {locationError
            ? locationError
            : userLocation
            ? "Your location detected successfully"
            : "Detecting your location..."}
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Enter area (Seeb, Maabilah, Hail...)"
          className="form-control"
          style={{ borderRadius: 8 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <hr className="mt-4" />

        {query && finalStores.length === 0 && (
          <p className="text-center" style={{ color: "gray" }}>
            No bookstores found for this location.
          </p>
        )}

        {/* STORES LIST */}
        {finalStores.map((store, i) => (
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
                    {store.distance && ` • ${store.distance.toFixed(2)} km away`}
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
