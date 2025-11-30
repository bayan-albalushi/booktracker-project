import * as yup from "yup";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  pwd: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPwd: yup
    .string()
    .oneOf([yup.ref("pwd"), null], "Passwords do not match")
    .required("Confirm password is required"),
});

export default registerSchema;
