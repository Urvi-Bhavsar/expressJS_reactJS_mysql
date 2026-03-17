const { Op } = require("sequelize");
const { Designation } = require("../models/designationModel");
const { Department } = require("../models/departmentModel");

const createDesignation = async (
  name,
  jobDescription,
  reportingManager,
  department,
) => {
  return await Designation.create({
    name,
    department,
    reportingManager,
    jobDescription,
  });
};

const getAllDesignation = async (
  offset,
  limit,
  sortOrder,
  sortField,
  search,
) => {
  const validSortFields = [
    "designationId",
    "name",
    "jobDescription",
    "reportingManager",
    "department",
  ];

  const field = validSortFields.includes(sortField)
    ? sortField
    : "designationId";

  const order = sortOrder === "ASC" ? "ASC" : "DESC";

  const whereCondition = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { jobDescription: { [Op.like]: `%${search}%` } },
        { reportingManager: { [Op.like]: `%${search}%` } },
        { department: { [Op.like]: `%${search}%` } },
      ],
    }
    : {};

  return await Designation.findAll({
    where: whereCondition,
    order: [[field, order]],
    required: true,
    include: [
      {
        model: Department,
        attributes: ["departmentId", "name"],
      },
    ],
    subQuery: false,
    limit,
    offset,
  });
};

const updateDesignationById = async (
  id,
  department,
  jobDescription,
  name,
  reportingManager,
) => {
  const affectedRows = await Designation.update(
    {
      name,
      department,
      jobDescription,
      reportingManager,
    },
    {
      where: { designationId: id },
    },
  );
  return { affectedRows };
};

const deleteDesignationById = async (id) => {
  const result = await Designation.destroy({
    where: { designationId: id },
  });

  return { affectedRows: result };
};

module.exports = {
  createDesignation,
  getAllDesignation,
  updateDesignationById,
  deleteDesignationById,
};
