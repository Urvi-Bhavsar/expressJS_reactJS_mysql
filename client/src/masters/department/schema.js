import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Department Name is required"),
  description: Yup.string().required("Description is required"),
});

export default validationSchema;
