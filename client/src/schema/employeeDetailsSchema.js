import * as yup from "yup";

const employeeDetailsSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.")
    .trim()
    .min(1, "Name cannot be empty")
    .max(10, "Name should have a maximum length of 10"),

  position: yup
    .string()
    .required("Position is required.")
    .trim()
    .min(1, "Position cannot be empty")
    .max(16, "Position should have a maximum length of 16"),

  age: yup
    .number()
    .required("Age is required.")
    .positive("Age must be a positive number")
    .integer("Age must be a whole number")
    .min(18, "Age must be at least 18")
    .max(999, "Age cannot exceed 999")
    .test("max-length", "Age should have a maximum length of 3", (value) => {
      return value && String(value).length <= 3;
    }),

  officeDays: yup
    .number()
    .required("Office Days is required.")
    .positive("Office Days must be a positive number")
    .integer("Office Days must be a whole number")
    .min(1, "Office Days must be at least 1")
    .max(31, "Office Days cannot exceed 31")
    .test(
      "max-length",
      "Office Days should have a maximum length of 2",
      (value) => {
        return value && String(value).length <= 2;
      }
    ),

  email: yup
    .string()
    .required("Email is required.")
    .trim()
    .email("The email format is invalid.")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|io|in)$/,
      "Email must end with .com, .io, or .in"
    ),
});
export { employeeDetailsSchema };
