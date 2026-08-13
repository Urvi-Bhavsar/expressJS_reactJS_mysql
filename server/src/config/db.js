const mysql = require("mysql2");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "my_db",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Required for TiDB Cloud Serverless
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true
  }
};
console.log("dbConfig", dbConfig);

const db = mysql.createPool(dbConfig);

let isConnected = false;
let connectionError = null;

db.getConnection((err, connection) => {
  if (err) {
    isConnected = false;
    connectionError = err;

    console.error("❌ Error connecting to MySQL database:");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
  } else {
    isConnected = true;
    connectionError = null;

    console.log("✅ Connected to MySQL database successfully.");

    connection.release();
  }
});

const checkDbConnection = (req, res, next) => {
  if (!isConnected) {
    return res.status(503).json({
      success: false,
      message: "Database connection is not available",
      error: {
        code: connectionError?.code || "DB_NOT_CONNECTED",
        details: connectionError?.message || "MySQL database is not connected"
      }
    });
  }

  next();
};

module.exports = {
  db,
  checkDbConnection,
  isConnected,
  getConnectionStatus: () => ({
    isConnected,
    error: connectionError
  })
};