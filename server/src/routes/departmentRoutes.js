const express = require("express");
const {
  getAllDepartmentsHandler,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
  departmentDropdownOptions,
} = require("../controllers/departmentController");
const {
  createDepartmentValidation,
} = require("../serializers/departmentSerializer");

const router = express.Router();
router.get("/", departmentDropdownOptions);
router.get("/list", getAllDepartmentsHandler);
router.post("/create", createDepartmentValidation, createDepartmentHandler);
router.put("/update/:id", createDepartmentValidation, updateDepartmentHandler);
router.delete("/delete/:id", deleteDepartmentHandler);

module.exports = router;
