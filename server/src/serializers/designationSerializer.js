const Joi = require("joi");

const getCustomErrors = (err) => {
  const errors = {};
  const processedFields = new Set(); // Track processed fields to avoid duplicates

  if (err.details) {
    err.details.forEach(({ path, message }) => {
      const field = path[0]; // Get the field name
      if (!processedFields.has(field)) {
        errors[field] = message; // Add only the first error for the field
        processedFields.add(field); // Mark this field as processed
      }
    });
  }

  return errors;
};

const createDesignationValidation = (req, res, next) => {
  //xor is used for or condition means atleast 1 field of mention in xor array fields has value means here in array mention name or email
  //means name or email atleast one of them is required
  //unknown is used for all the remaining body which is not mention validation of that field in this schema allowed.
  const schema = Joi.object()
    .keys({
      name: Joi.string().required().max(20).messages({
        "any.required": "Name is required.",
        "string.empty": "Name is required.",
        "string.max": "Name should have a maximum length of 20",
      }),
      reportingManager: Joi.string().required().max(20).messages({
        "any.required": "Reporting Manager is required.",
        "string.empty": "Reporting Manager is required.",
        "string.max": "Reporting Manager should have a maximum length of 20",
      }),
      jobDescription: Joi.string().required().max(120).messages({
        "any.required": "Job Description is required.",
        "string.empty": "Job Description is required.",
        "string.max": "Job Description should have a maximum length of 120",
      }),
    })
    .unknown(true);
  // abortEarly used for send all the fields errors gives together otherwise it will give only 1 field error after resolve 1 field error it give 2nd field error
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).send({
      message: "Failed to create designation.",
      error: getCustomErrors(error),
    });
  } else {
    next();
  }
};

module.exports = {
  createDesignationValidation,
};
