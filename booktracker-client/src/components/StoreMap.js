import { useLocation, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect } from "react";

export default function StoreMap() {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);

  const name = params.get("name");
  const lat = params.get("lat");
  const lon = params.get("lon");

  // ===============================
  // GUARD: لو البيانات ناقصة
  // ===============================
  useEffect(() => {
    if (!name || !lat || !lon) {
      navigate("/user/NearbyBookStores");
    }
  }, [name, lat, lon, navigate]);

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
        <Link
          to="/user/NearbyBookStores"
          style={{ color: "black", marginRight: 15 }}
        >
          <FiArrowLeft size={26} />
        </Link>

        <span style={{ fontSize: 24, fontWeight: "bold" }}>
          {name || "Store Location"}
        </span>
      </div>

      {/* MAP */}
      {lat && lon && (
        <iframe
          title="store-map"
          width="100%"
          height="500"
          style={{ border: "none", marginTop: 20 }}
          src={`https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`}
        ></iframe>
      )}
    </>
  );
}
