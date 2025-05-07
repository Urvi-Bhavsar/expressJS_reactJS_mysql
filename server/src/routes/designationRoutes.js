const express = require("express");
const {
  createDesignationValidation,
} = require("../serializers/designationSerializer");
const {
  createDesignationHandler,
  getAllDesignationHandler,
  updateDesignationHandler,
  deleteDesignationHandler,
} = require("../controllers/designationController");
const { deleteDesignationById } = require("../models/designationModel");

const router = express.Router();

router.post("/create", createDesignationValidation, createDesignationHandler);
router.get("/list", getAllDesignationHandler);
router.put(
  "/update/:id",
  createDesignationValidation,
  updateDesignationHandler
);
router.delete("/delete/:id", deleteDesignationHandler);

module.exports = router;
