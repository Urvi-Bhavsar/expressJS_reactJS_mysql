#!/usr/bin/env node

/**
 * Database Connection Checker
 * Run this script to verify your database setup before starting the server
 * Usage: node check-db.js
 */

const mysql = require("mysql2");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "my_db",
};

console.log("🔍 Checking MySQL Database Connection...\n");
console.log("Configuration:");
console.log(`  Host: ${dbConfig.host}`);
console.log(`  User: ${dbConfig.user}`);
console.log(`  Database: ${dbConfig.database}\n`);

// Test connection without database first
const testConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        minVersion: "TLSv1.2"
    }
});

testConnection.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL server\n");
    console.error("Error Details:");
    console.error(`  Code: ${err.code}`);
    console.error(`  Message: ${err.message}\n`);

    if (err.code === "ECONNREFUSED") {
      console.error("💡 Troubleshooting Steps:");
      console.error("  1. Make sure MySQL is installed");
      console.error("  2. Start MySQL service:");
      console.error("     sudo systemctl start mysql");
      console.error("  3. Check MySQL status:");
      console.error("     sudo systemctl status mysql\n");
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("💡 Troubleshooting Steps:");
      console.error("  1. Check your credentials in .env file");
      console.error("  2. Reset MySQL root password:");
      console.error("     sudo mysql");
      console.error("     ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';");
      console.error("     FLUSH PRIVILEGES;");
      console.error("     EXIT;\n");
    } else {
      console.error("💡 Check the error message above and update your .env file accordingly\n");
    }

    process.exit(1);
  }

  console.log("✅ Successfully connected to MySQL server\n");

  // Check if database exists
  testConnection.query(`SHOW DATABASES LIKE '${dbConfig.database}'`, (err, results) => {
    if (err) {
      console.error("❌ Error checking database:", err.message);
      testConnection.end();
      process.exit(1);
    }

    if (results.length === 0) {
      console.log(`⚠️  Database '${dbConfig.database}' does not exist\n`);
      console.log("💡 Create it with:");
      console.log(`   mysql -u ${dbConfig.user} -p`);
      console.log(`   CREATE DATABASE ${dbConfig.database};`);
      console.log(`   EXIT;\n`);
      testConnection.end();
      process.exit(1);
    }

    console.log(`✅ Database '${dbConfig.database}' exists\n`);

    // Now connect to the specific database
    testConnection.changeUser({ database: dbConfig.database }, (err) => {
      if (err) {
        console.error("❌ Error accessing database:", err.message);
        testConnection.end();
        process.exit(1);
      }

      // Check if table exists
      testConnection.query("SHOW TABLES LIKE 'employeeDetails'", (err, results) => {
        if (err) {
          console.error("❌ Error checking tables:", err.message);
          testConnection.end();
          process.exit(1);
        }

        if (results.length === 0) {
          console.log("ℹ️  Table 'employeeDetails' does not exist yet");
          console.log("   (It will be created automatically when you start the server)\n");
        } else {
          console.log("✅ Table 'employeeDetails' exists\n");

          // Count rows
          testConnection.query("SELECT COUNT(*) as count FROM employeeDetails", (err, results) => {
            if (err) {
              console.error("⚠️  Error counting rows:", err.message);
            } else {
              console.log(`📊 Current employee records: ${results[0].count}\n`);
            }

            testConnection.end();
            console.log("✅ All checks passed! Your database is ready.");
            console.log("🚀 You can now start the server with: npm start\n");
            process.exit(0);
          });
          return;
        }

        testConnection.end();
        console.log("✅ Database setup is ready!");
        console.log("🚀 You can now start the server with: npm start\n");
        process.exit(0);
      });
    });
  });
});
