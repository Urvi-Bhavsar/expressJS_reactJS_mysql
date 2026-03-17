import * as yup from "yup";

const employeeDetailsSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.")
    .max(10, "Name should have a maximum length of 10"),

  position: yup
    .string()
    .required("Position is required.")
    .max(16, "Position should have a maximum length of 16"),

  age: yup
    .number()
    .required("Age is required.")
    .test("max-length", "Age should have a maximum length of 3", (value) => {
      return value && String(value).length <= 3;
    }),

  officeDays: yup
    .number()
    .required("Office Days is required.")
    .test(
      "max-length",
      "Office Days should have a maximum length of 2",
      (value) => {
        return value && String(value).length <= 2;
      }
    )
    .test(
      "less than 31",
      "Office Days should have a less than of 31",
      (value) => {
        return value && Number(value) <= 31;
      }
    ),

  email: yup
    .string()
    .required("Email is required.")
    .email("The email format is invalid.")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|io|in)$/,
      "Email must end with .com, .io, or .in"
    ),

  mobile_no: yup
    .number()
    .required("Mobile No is required.")
    .test(
      "max-length",
      "Mobile No should have a maximum length of 2",
      (value) => {
        return value && String(value).length == 10;
      }
    ),

  date_of_birth: yup.object().required("Date of Birth is required."),

  gender: yup.string().required("Gender is required."),

  department: yup.object().required("Department is required"),

  designation: yup.object().required("Designation is required"),

  skills: yup.array().test("max-length", "Skills is required", (value) => {
    return !!value.length;
  }),

  country: yup.object().required("Country is required."),

  state: yup
    .object()
    .nullable()
    .test("required", "State is required.", (value, { parent }) => {
      if (!!parent?.country & !value) {
        return false;
      } else {
        return true;
      }
    }),

  city: yup
    .object()
    .nullable()
    .test("required", "City is required.", (value, { parent }) => {
      if (!!(parent?.country && parent?.state) & !value) {
        return false;
      } else {
        return true;
      }
    }),
});
export { employeeDetailsSchema };
