import { Container, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import { adminLoginThunk, clearAdminMsg } from "../slices/adminSlice";
import { userLoginThunk, clearUserMsg } from "../slices/userSlice";

import bookLogo from "../images/book.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localMsg, setLocalMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminMsg = useSelector((state) => state.admin.msg);
  const adminData = useSelector((state) => state.admin.admin);

  const userMsg = useSelector((state) => state.user.msg);
  const userData = useSelector((state) => state.user.user);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setLocalMsg("All fields are required");
      return;
    }

    setLocalMsg("");

    const data = { email, password };

    // ✅ Admin detection
    if (email.toLowerCase().includes("admin")) {
      dispatch(adminLoginThunk(data));
    } else {
      dispatch(userLoginThunk(data));
    }
  };

  // ✅ clear msgs while typing
  useEffect(() => {
    if (email || password) {
      dispatch(clearAdminMsg());
      dispatch(clearUserMsg());
    }
  }, [email, password, dispatch]);


  useEffect(() => {
    if (adminData) {
      localStorage.setItem("admin", JSON.stringify(adminData));
      dispatch(clearAdminMsg());
      navigate("/admin-dashboard");
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(clearUserMsg());
      navigate("/user/home");
    }
  }, [adminData, userData, navigate, dispatch]);

  return (
    <>
      <style>
        {`
          ::placeholder {
            color: #c2c2c2 !important;
            opacity: 1;
          }
        `}
      </style>

      <Container
        className="col-4 mt-5 shadow p-0"
        style={{ backgroundColor: "#F5F5F5", borderRadius: "12px" }}
      >
        <div
          style={{
            backgroundColor: "#A47C78",
            padding: "15px 0",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            textAlign: "center",
          }}
        >
          <img
            src={bookLogo}
            alt="logo"
            style={{ height: "35px", marginRight: "10px" }}
          />

          <span
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              verticalAlign: "middle",
              color: "black",
            }}
          >
            BOOK TRACKER
          </span>
        </div>

        <div className="p-4 text-center">
          <h3 className="fw-bold mb-4">Login</h3>

          <form onSubmit={handleLogin}>
            <FormGroup>
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>

            <button
              className="btn w-100 mt-2"
              style={{
                backgroundColor: "#A47C78",
                color: "black",
                fontWeight: "bold",
                borderRadius: "20px",
              }}
            >
              Sign In
            </button>
          </form>

          {(localMsg || adminMsg || userMsg) && (
            <p className="text-danger fw-bold mt-2">
              {localMsg || adminMsg || userMsg}
            </p>
          )}

          <div className="mt-3">
            <Link className="text-decoration-none" to="/forgotPassword">
              Forget password?
            </Link>
          </div>

          <hr />

          <p>
            Don’t have an account?
            <Link className="ms-1 fw-bold text-decoration-none" to="/register">
              Register
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
}
