const mysql = require("mysql2");
require("dotenv").config();

// Create connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "my_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const db = mysql.createPool(dbConfig);

// Track connection status
let isConnected = false;
let connectionError = null;

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    isConnected = false;
    connectionError = err;
    console.error("❌ Error connecting to MySQL database:");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    console.error("\n⚠️  DATABASE CONNECTION FAILED - Server will continue running but database operations will fail.");
    console.error("\n📝 To fix this issue:");
    console.error("1. Make sure MySQL is installed and running");
    console.error("2. Check your database credentials in .env file");
    console.error("3. Create the database if it doesn't exist:");
    console.error(`   - Run: CREATE DATABASE ${dbConfig.database};`);
    console.error("4. Verify MySQL service is running:");
    console.error("   - Linux: sudo systemctl status mysql");
    console.error("   - Or check DBeaver connection settings\n");
  } else {
    isConnected = true;
    connectionError = null;
    console.log("✅ Connected to MySQL database successfully.");
    connection.release(); // Release the connection back to the pool
  }
});

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (!isConnected) {
    return res.status(503).json({
      success: false,
      message: "Database connection is not available",
      error: {
        code: connectionError?.code || "DB_NOT_CONNECTED",
        details: "MySQL database is not connected. Please check server logs for more information.",
        suggestions: [
          "Ensure MySQL server is running",
          "Verify database credentials in .env file",
          "Check if the database exists",
          "Verify MySQL service is accessible on the configured host and port",
        ],
      },
    });
  }
  next();
};

module.exports = { db, checkDbConnection, isConnected, getConnectionStatus: () => ({ isConnected, error: connectionError }) };
