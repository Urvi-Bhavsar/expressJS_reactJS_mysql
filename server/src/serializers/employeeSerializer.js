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

const createEmployeeValidation = (req, res, next) => {
  //xor is used for or condition means atleast 1 field of mention in xor array fields has value means here in array mention name or email
  //means name or email atleast one of them is required
  //unknown is used for all the remaining body which is not mention validation of that field in this schema allowed.
  const schema = Joi.object()
    .keys({
      name: Joi.string().trim().required().min(1).max(10).messages({
        "any.required": "Name is required.",
        "string.empty": "Name is required.",
        "string.min": "Name cannot be empty",
        "string.max": "Name should have a maximum length of 10",
      }),
      position: Joi.string().trim().required().min(1).max(16).messages({
        "any.required": "Position is required.",
        "string.empty": "Position is required.",
        "string.min": "Position cannot be empty",
        "string.max": "Position should have a maximum length of 16",
      }),
      age: Joi.number()
        .required()
        .integer()
        .min(18)
        .max(999)
        .custom((value, msg) => {
          if (String(value).length > 3) {
            return msg.message("Age should have a maximum length of 3");
          } else {
            return true;
          }
        })
        .messages({
          "number.base": "Age must be a number.",
          "any.required": "Age is required.",
          "number.integer": "Age must be a whole number.",
          "number.min": "Age must be at least 18",
          "number.max": "Age cannot exceed 999",
        }),
      officeDays: Joi.number()
        .required()
        .integer()
        .min(1)
        .max(31)
        .custom((value, msg) => {
          if (String(value).length > 2) {
            return msg.message("Office Days should have a maximum length of 2");
          } else {
            return true;
          }
        })
        .messages({
          "number.base": "Office Days must be a number.",
          "any.required": "Office Days is required.",
          "number.integer": "Office Days must be a whole number.",
          "number.min": "Office Days must be at least 1",
          "number.max": "Office Days cannot exceed 31",
        }),
      email: Joi.string()
        .trim()
        .required()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "io", "in"] },
        })
        .messages({
          "any.required": "Email is required.",
          "string.empty": "Email is required.",
          "string.email":
            "The email domain must contain at least two segments (e.g., example.com) and must end with .com, .io, or .in.",
        }),
    })
    .unknown(true);
  // abortEarly used for send all the fields errors gives together otherwise it will give only 1 field error after resolve 1 field error it give 2nd field error
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res
      .status(400)
      .send({
        message: "Failed to create employee.",
        error: getCustomErrors(error),
      });
  } else {
    next();
  }
};

module.exports = {
  createEmployeeValidation,
};
