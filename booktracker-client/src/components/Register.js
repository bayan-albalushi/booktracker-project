import { Container, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import registerSchema from "../validations/registerSchema";
import bookLogo from "../images/book.png";

export default function Register() {
  const [msg, setMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const submitForm = async (data) => {
    try {
      const userData = {
        userName: data.username,
        userEmail: data.email,
        userPassword: data.pwd,
      };

      const res = await axios.post(
        "https://booktracker-project.onrender.com/userRegister",
        userData
      );

      setMsg(res.data.msg);
    } catch (err) {
      setMsg("Server Error");
    }
  };

  return (
    <>
      {/* Placeholder Color */}
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
        {/* Header */}
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

        {/* Form */}
        <div className="p-4 text-center">
          <h3 className="fw-bold mb-4">Register</h3>

          <form onSubmit={handleSubmit(submitForm)}>
            {/* USERNAME */}
            <FormGroup>
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                {...register("username")}
              />
              <p className="text-danger">{errors.username?.message}</p>
            </FormGroup>

            {/* EMAIL */}
            <FormGroup>
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                {...register("email")}
              />
              <p className="text-danger">{errors.email?.message}</p>
            </FormGroup>

            {/* PASSWORD */}
            <FormGroup>
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                {...register("pwd")}
              />
              <p className="text-danger">{errors.pwd?.message}</p>
            </FormGroup>

            {/* CONFIRM PASSWORD */}
            <FormGroup>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control"
                {...register("confirmPwd")}
              />
              <p className="text-danger">{errors.confirmPwd?.message}</p>
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
              Sign Up
            </button>
          </form>

          {msg && <p className="mt-2 text-danger fw-bold">{msg}</p>}

          <hr className="mt-4" />

          <p>
            Already have an account?
            <Link className="ms-1 fw-bold text-decoration-none" to="/">
              Sign In
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
}
