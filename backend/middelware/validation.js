const { body } = require("express-validator");

const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3 to 20 characters"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be 6 to 20 characters"),

  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be 10 digits")
    .isNumeric()
    .withMessage("Phone must contain only numbers"),
];

const updateValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3 to 20 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .optional()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be 6 to 20 characters"),

  body("phone")
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be 10 digits")
    .isNumeric()
    .withMessage("Phone must contain only numbers"),
];

module.exports = {
  registerValidation,
  updateValidation,
};