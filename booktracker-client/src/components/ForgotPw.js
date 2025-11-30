import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import bookLogo from "../images/book.png";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";

export default function ForgotPw() {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      alert("Please enter your email");
      return;
    }

    alert("A reset link has been sent to your email.");
  };

  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#A47C78",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Back Arrow */}
        <Link to="/" style={{ color: "black", marginRight: "15px" }}>
          <FiArrowLeft size={26} />
        </Link>

        {/* Logo & Title */}
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
      </div>

      {/* Main Content */}
      <Container className="text-center mt-5">

        <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
          Forget Password
        </h2>

        <p
          style={{
            maxWidth: "380px",
            margin: "0 auto",
            lineHeight: "1.6",
            fontSize: "16px",
          }}
        >
          Provide your Email and we will send you a link  
          to reset your password.
        </p>

        <div className="mt-5">
          <h5 style={{ textAlign: "left", marginLeft: "10px" }}>
            Enter your Email:
          </h5>

          {/* Input */}
          <input
            type="email"
            className="form-control mt-2"
            style={{
              height: "50px",
              borderRadius: "0px",
              border: "1px solid black",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Button */}
          <button
            onClick={handleReset}
            className="btn mt-4"
            style={{
              backgroundColor: "#A47C78",
              color: "black",
              width: "180px",
              height: "45px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Reset Password
          </button>
        </div>
      </Container>
    </>
  );
}
