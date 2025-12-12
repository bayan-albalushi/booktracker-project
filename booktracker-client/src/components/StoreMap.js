import { useLocation, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function StoreMap() {
  const params = new URLSearchParams(useLocation().search);

  const name = params.get("name");
  const lat = params.get("lat");
  const lon = params.get("lon");

  return (
    <>
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

        <span style={{ fontSize: 24, fontWeight: "bold" }}>{name}</span>
      </div>

      <iframe
        width="100%"
        height="500"
        style={{ border: "none", marginTop: 20 }}
        src={`https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`}
      ></iframe>
    </>
  );
}
