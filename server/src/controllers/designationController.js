const {
  createDesignation,
  createTableIfNotExists,
  getAllDesignation,
  getTotalDesignationCount,
  updateDesignationById,
  deleteDesignationById,
} = require("../models/designationModel");
const createDesignationHandler = async (req, res) => {
  const { department, jobDescription, name, reportingManager } = req.body;

  createTableIfNotExists((err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to ensure table exists", err });
    }
  });

  createDesignation(
    name,
    jobDescription,
    reportingManager,
    department,
    async (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Failed to create designation", err });
      }
      try {
        res.send({
          data: { name, jobDescription, reportingManager, department },
          message: "Designation added successfully",
        });
      } catch {
        return res
          .status(400)
          .send({ message: "Failed to create designation", err });
      }
    }
  );
};

const getAllDesignationHandler = (req, res) => {
  createTableIfNotExists((err) => {
    if (err) {
      return res.status(500).send({
        message: "Failed to ensure table exists",
        err,
      });
    }
    const {
      page = 1,
      pageSize = 5,
      sortField = "",
      sortOrder = "",
      search = "",
    } = req.query;
    const currentPage = parseInt(page, 10);
    const limit = parseInt(pageSize, 10);
    const offset = (currentPage - 1) * limit;

    getTotalDesignationCount(search, (err, totalEntries) => {
      if (err) {
        return res.status(500).send({
          message: "Failed to fetch total designation count",
          err,
        });
      }
      getAllDesignation(
        offset,
        limit,
        sortOrder,
        sortField,
        search,
        (err, designations) => {
          if (err) {
            return res.status(500).send({
              message: "Failed to fetch designations",
              err,
            });
          }

          const next =
            currentPage * limit < totalEntries ? currentPage + 1 : null;

          res.send({
            data: designations?.map((row) => ({
              ...row,
              department: {
                value: departments.find((d) => d.id == row.department).id,
                label: departments.find((d) => d.id == row.department).name,
              },
            })),
            currentPage: !designations.length ? currentPage - 1 : currentPage,
            pageSize: limit,
            next,
            totalEntries,
            message: "Designation details fetched successfully",
          });
        }
      );
    });
  });
};
const departments = [
  { id: 1, name: "HR" },
  { id: 2, name: "Engineering" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "Sales" },
  // …add or remove as needed
];

/**
 * Returns that array, wrapped in a Promise for consistency.
 */
function getAllDepartmentsFromDB() {
  return Promise.resolve(departments);
}

const updateDesignationHandler = (req, res) => {
  const { id } = req.params;

  const { department, jobDescription, name, reportingManager } = req.body;

  updateDesignationById(
    id,
    department,
    jobDescription,
    name,
    reportingManager,
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Failed to update designation", err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "designation not found" });
      }
      res.send({
        data: { id, department, jobDescription, name, reportingManager },
        message: "Designation updated successfully",
      });
    }
  );
};

const deleteDesignationHandler = (req, res) => {
  const { id } = req.params;
  deleteDesignationById(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to delete designation", err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Designation not found" });
    }
    res.send({ message: "Designation deleted successfully" });
  });
};

module.exports = {
  createDesignationHandler,
  getAllDesignationHandler,
  getAllDesignationHandler,
  updateDesignationHandler,
  deleteDesignationHandler,
  getAllDepartmentsFromDB,
};
