import * as Yup from "yup";

export interface ISignInForm {
  email: string;
  password: string;
}

export function getValidationSignInSchema(): Yup.ObjectSchema<ISignInForm> {
  return Yup.object().shape({
    email: Yup.string()
      .email("common.email_invalid") // Validates if the value is a valid email
      .max(60, "common.email_max") // Restricts email to a maximum length of 60 characters
      .required("common.email_empty"), // Ensures email is not empty

    password: Yup.string()
      .min(6, "common.password_min") // Minimum 6 characters for the password
      .max(30, "common.password_max") // Maximum 30 characters for the password
      .required("common.password_empty"), // Ensures password is not empty
  });
}
