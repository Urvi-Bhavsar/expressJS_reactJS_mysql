const { Op } = require('sequelize');
const DesignationModel = require('../models/designationModel');

const departments = [
  { id: 1, name: 'HR' },
  { id: 2, name: 'Engineering' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Sales' },
];

// ✅ same as original: createTableIfNotExists
const createTableIfNotExists = async () => {
  try {
    await DesignationModel.sync({ force: false });
    console.log('Designation table synced successfully');
  } catch (err) {
    console.error('Table sync failed:', err);
    throw err;
  }
};

// ✅ same as original: createDesignation
const createDesignation = async ({ name, jobDescription, reportingManager, department }) => {
  const result = await DesignationModel.create({
    name,
    jobDescription,
    reportingManager,
    department,
  });
  return result;
};

// ✅ same as original: getAllDesignation
const getAllDesignation = async ({ page = 1, pageSize = 5, sortField = '', sortOrder = '', search = '' }) => {
  const validSortFields = ['designationId', 'name', 'jobDescription', 'reportingManager', 'department'];
  const validSortOrders = ['ASC', 'DESC'];

  const field = validSortFields.includes(sortField) ? sortField : 'designationId';
  const order = validSortOrders.includes(sortOrder) ? sortOrder : 'DESC';

  const currentPage = parseInt(page, 10);
  const limit = parseInt(pageSize, 10);
  const offset = (currentPage - 1) * limit;

  const whereClause = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { jobDescription: { [Op.like]: `%${search}%` } },
        { reportingManager: { [Op.like]: `%${search}%` } },
      ],
    }
    : {};

  const { rows, count: totalEntries } = await DesignationModel.findAndCountAll({
    where: whereClause,
    order: [[field, order]],
    limit,
    offset,
  });
  console.log("rows", rows);

  const data = rows.map((row) => {
    const dept = departments.find((d) => d.id === row.department);
    return {
      ...row.toJSON(),
      department: dept
        ? { value: dept.id, label: dept.name }
        : { value: row.department, label: 'Unknown' },
    };
  });

  const next = currentPage * limit < totalEntries ? currentPage + 1 : null;

  return {
    data,
    currentPage: !rows.length ? currentPage - 1 : currentPage,
    pageSize: limit,
    next,
    totalEntries,
  };
};

// ✅ same as original: getTotalDesignationCount
const getTotalDesignationCount = async (search = '') => {
  const whereClause = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { jobDescription: { [Op.like]: `%${search}%` } },
        { reportingManager: { [Op.like]: `%${search}%` } },
      ],
    }
    : {};

  const total = await DesignationModel.count({ where: whereClause });
  return total;
};

// ✅ same as original: getAllDepartmentsFromDB
const getAllDepartmentsFromDB = async () => {
  return Promise.resolve(departments);
};

// ✅ same as original: updateDesignationById
const updateDesignationById = async (id, { name, jobDescription, reportingManager, department }) => {
  const [affectedRows] = await DesignationModel.update(
    { name, jobDescription, reportingManager, department },
    { where: { designationId: id } }
  );
  return affectedRows;
};

// ✅ same as original: deleteDesignationById
const deleteDesignationById = async (id) => {
  const deleted = await DesignationModel.destroy({
    where: { designationId: id },
  });
  return deleted;
};

module.exports = {
  createTableIfNotExists,
  createDesignation,
  getAllDesignation,
  getTotalDesignationCount,
  getAllDepartmentsFromDB,
  updateDesignationById,
  deleteDesignationById,
};