const {
  createDepartmentTableIfNotExists,
  Department,
} = require("../models/departmentModel");
const {
  getAllDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentDropdownOptions
} = require("../services/departmentService");

const getAllDepartmentsHandler = async (req, res) => {
  try {
    await createDepartmentTableIfNotExists();

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

    const departments = await getAllDepartment(
      offset,
      limit,
      sortOrder,
      sortField,
      search,
    );

    const next =
      currentPage * limit < departments?.length ? currentPage + 1 : null;

    res.send({
      data: departments.map((row) => ({
        ...row.dataValues,
        department: {
          value: departments.find((d) => d.id == row.department)?.id,
          label: departments.find((d) => d.id == row.department)?.name,
        },
      })),
      currentPage,
      pageSize: limit,
      next,
      totalEntries: departments?.length,
      message: "Department details fetched successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch departments",
      err,
    });
  }
};

const createDepartmentHandler = async (req, res) => {
  try {
    await createDepartmentTableIfNotExists();
    const { name, description } = req.body;

    await createDepartment(name, description);

    res.send({
      data: { name, description },
      message: "Department added successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to create Department",
      err: err.message,
    });
  }
};

const departmentDropdownOptions = async (req, res) => {
  try {
    const results = await getDepartmentDropdownOptions()
    res.send({
      data: results,
      message: "Department added successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to create Department",
      err: err.message,
    });
  }
};

const updateDepartmentHandler = async (req, res) => {
  try {
    const { departmentId, name, description } = req.body
    const result = await updateDepartment(departmentId, name, description)

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Department not found" });
    }

    res.send({
      data: { departmentId, name, description },
      message: "Department updated successfully",
    })
  } catch (err) {
    res.status(500).send({
      message: "Failed to update Department",
      err: err.message,
    });
  }
};

const deleteDepartmentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDepartment(id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Department not found" });
    }

    res.send({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).send({
      message: "Failed to delete Department",
      err: err.message,
    });
  }
};

module.exports = {
  getAllDepartmentsHandler,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
  departmentDropdownOptions
};
