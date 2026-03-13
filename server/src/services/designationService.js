const { Op } = require("sequelize");
const { designationMaster, createDesignationTableIfNotExists } = require("../models/designationModel");

const createDesignation = async (
  name,
  jobDescription,
  reportingManager,
  department
) => {
  return await designationMaster.create({
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
  search
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

  return await designationMaster.findAll({
    where: whereCondition,
    order: [[field, order]],
    limit,
    offset,
  });
};

const updateDesignationById = async (
  id,
  department,
  jobDescription,
  name,
  reportingManager
) => {
  const affectedRows = await designationMaster.update(
    {
      name,
      department,
      jobDescription,
      reportingManager,
    },
    {
      where: { designationId: id },
    }
  );
  return { affectedRows };
};

const deleteDesignationById = async (id) => {
  const result = await designationMaster.destroy({
    where: { designationId: id },
  });

  return { affectedRows: result };
};

module.exports = {
  createDesignation,
  createDesignationTableIfNotExists,
  getAllDesignation,
  updateDesignationById,
  deleteDesignationById,
};