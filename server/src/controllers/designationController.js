const { createDesignationTableIfNotExists } = require("../models/designationModel");
const {
  createDesignation,
  getAllDesignation,
  updateDesignationById,
  deleteDesignationById,
} = require("../services/designationService");



const createDesignationHandler = async (req, res) => {
  try {
    await createDesignationTableIfNotExists();
    const { department, jobDescription, name, reportingManager } = req.body;

    await createDesignation(name, jobDescription, reportingManager, department);

    res.send({
      data: { name, jobDescription, reportingManager, department },
      message: "Designation added successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to create designation",
      err: err.message,
    });
  }
};

const getAllDesignationHandler = async (req, res) => {
  try {
    await createDesignationTableIfNotExists();

    const {
      page = 1,
      pageSize = 5,
      sortField = "",
      sortOrder = "",
      search = "",
    } = req.query;

    const currentPage = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10);
    const offset = (currentPage - 1) * limit;

    const designations = await getAllDesignation(
      offset,
      limit,
      sortOrder,
      sortField,
      search
    );

    const next = currentPage * limit < designations?.length ? currentPage + 1 : null;

    res.send({
      data: designations.map((row) => ({
        ...row.dataValues,
        // department: {
        //   value: departments.find((d) => d.id == row.Department)?.departmentId,
        //   label: departments.find((d) => d.id == row.Department)?.name,
        // },
      })),
      currentPage,
      pageSize: limit,
      next,
      totalEntries: designations?.length,
      message: "Designation details fetched successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch designations",
      err: err.message,
    });
  }
};

const updateDesignationHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { department, jobDescription, name, reportingManager } = req.body;

    const result = await updateDesignationById(
      id,
      department,
      jobDescription,
      name,
      reportingManager
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "designation not found" });
    }

    res.send({
      data: { id, department, jobDescription, name, reportingManager },
      message: "Designation updated successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to update designation",
      err,
    });
  }
};

const deleteDesignationHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteDesignationById(id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Designation not found" });
    }

    res.send({ message: "Designation deleted successfully" });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete designation",
      err,
    });
  }
};

module.exports = {
  createDesignationHandler,
  getAllDesignationHandler,
  updateDesignationHandler,
  deleteDesignationHandler,
};