const db = require("../config/db");

const createDesignation = (
  name,
  jobDescription,
  reportingManager,
  department,
  callback
) => {
  // This query is used for inserting a single row into the table at a time, with placeholders for each column value. The ? placeholders are replaced with actual values one by one.
  const query = `
    INSERT INTO designationMaster (name, department, reportingManager, jobDescription)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, department, reportingManager, jobDescription],
    (err, result) => {
      callback(err, result);
    }
  );
};

const createTableIfNotExists = (callback) => {
  const query = `
     CREATE TABLE IF NOT EXISTS designationMaster (
        designationId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department INT,  
        reportingManager VARCHAR(100),
        jobDescription TEXT
    );`;
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const getAllDesignation = (
  offset,
  limit,
  sortOrder,
  sortField,
  search,
  callback
) => {
  // Validate sortField and sortOrder (optional)
  const validSortFields = [
    "designationId",
    "name",
    "jobDescription",
    "reportingManager",
    "department", // Adjust as needed to match the correct field for sorting
  ];
  const validSortOrders = ["ASC", "DESC"]; // Allowed sort orders

  // Validate the sortField
  const field = validSortFields.includes(sortField)
    ? sortField
    : "designationId";
  // Validate the sortOrder
  const order = validSortOrders.includes(sortOrder) ? sortOrder : "DESC";

  // Ensure limit and offset are integers
  const queryParams = search
    ? [
        `%${search}%`, // for name
        `%${search}%`, // for jobDescription
        `%${search}%`, // for reportingManager
        `%${search}%`, // for department (if department is string, keep LIKE)
        limit, // ensure limit is an integer
        offset, // ensure offset is an integer
      ]
    : [limit, offset]; // Default queryParams if no search

  const searchCondition = search
    ? `WHERE name LIKE ? OR jobDescription LIKE ? OR reportingManager LIKE ? OR department LIKE ?`
    : "";

  const query = `
        SELECT * FROM designationMaster
        ${searchCondition}
        ORDER BY ${field} ${order}
        LIMIT ? OFFSET ?`;

  db.query(query, queryParams, (err, result) => {
    callback(err, result);
  });
};

const getTotalDesignationCount = (search, callback) => {
  const searchCondition = search
    ? `WHERE name LIKE ? OR jobDescription LIKE ? OR reportingManager LIKE ? OR department LIKE ? `
    : ``;

  const query = `SELECT COUNT(*) AS total FROM designationMaster ${searchCondition}`;

  const queryParams = search
    ? [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ]
    : [];

  db.query(query, queryParams, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result[0].total);
  });
};
const updateDesignationById = (
  id,
  department,
  jobDescription,
  name,
  reportingManager,
  callback
) => {
  const query = `
      UPDATE designationMaster
      SET name = ?, department = ?, jobDescription = ?, reportingManager = ?
      WHERE designationId = ?
    `;
  db.query(
    query,
    [name, department, jobDescription, reportingManager, id],
    (err, result) => {
      callback(err, result);
    }
  );
};
const deleteDesignationById = (id, callback) => {
  const query = `
      DELETE FROM designationMaster
      WHERE designationId = ?
    `;
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

module.exports = {
  createDesignation,
  createTableIfNotExists,
  getAllDesignation,
  getTotalDesignationCount,
  updateDesignationById,
  deleteDesignationById,
};
