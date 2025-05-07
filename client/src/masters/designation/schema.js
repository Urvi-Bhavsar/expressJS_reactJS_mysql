import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Designation Name is required"),
  department: Yup.object().required("Department is required"),
  reportingManager: Yup.string().required("Reporting Manager is required"),
  jobDescription: Yup.string().required("Job Description is required"),
});

export default validationSchema;
