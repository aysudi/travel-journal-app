import * as Yup from "yup";

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export default forgotPasswordValidationSchema;
