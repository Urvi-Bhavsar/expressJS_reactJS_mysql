const { Department } = require("../models/departmentModel");

const getAllDepartment = async (
  offset,
  limit,
  sortOrder,
  sortField,
  search
) => {
  const validSortFields = [
    "departmentId",
    "name",
    "description",
  ];

  const field = validSortFields.includes(sortField)
    ? sortField
    : "departmentId";

  const order = sortOrder === "ASC" ? "ASC" : "DESC";

  const whereCondition = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ],
    }
    : {};

  return await Department.findAll({
    where: whereCondition,
    order: [[field, order]],
    limit,
    offset,
  });
};

const createDepartment = async (name, description) => {
  return await Department.create({
    name, description,
  });
};

const updateDepartment = async (departmentId, name, description) => {
  const affectedRows = await Department.update({
    name, description
  }, {
    where: { departmentId }
  })
  return { affectedRows }
}

const deleteDepartment = async (id) => {
  const result = await Department.destroy({
    where: { departmentId: id },
  });

  return { affectedRows: result };
};


const getDepartmentDropdownOptions = async () => {
  const dropdownOptions = await Department.findAll({
    attributes: ["departmentId", "name"]
  });
  const updatedDropdownOptions = dropdownOptions?.map((ele) => {
    return {
      value: ele?.departmentId,
      label: ele?.name
    }
  }
  )
  return updatedDropdownOptions;
};


module.exports = {
  getAllDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentDropdownOptions
}