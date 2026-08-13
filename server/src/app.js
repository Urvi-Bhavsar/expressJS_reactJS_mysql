const express = require("express");
const corsMiddleware = require("../src/middlewares/cors");
const { getConnectionStatus } = require("./config/db");
require("dotenv").config();

const app = express();

// Use CORS middleware
app.use(corsMiddleware);

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus = getConnectionStatus();
  res.status(dbStatus.isConnected ? 200 : 503).json({
    status: dbStatus.isConnected ? "healthy" : "unhealthy",
    database: {
      connected: dbStatus.isConnected,
      error: dbStatus.error ? {
        code: dbStatus.error.code,
        message: dbStatus.error.message,
      } : null,
    },
    timestamp: new Date().toISOString(),
  });
});

// Define routes
app.use("/", require("./routes/employeeRoutes"));

// Start the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health\n`);
});

