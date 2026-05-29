const express = require("express");
const corsMiddleware = require("../src/middlewares/cors");
require("dotenv").config();

const app = express();

// Use CORS middleware
app.use(corsMiddleware);

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use("/", require("./routes/employeeRoutes"));
app.use("/api/s3", require("./routes/s3Routes"));
app.use("/designation", require("./routes/designationRoutes"));
app.use("/departments", require("./routes/departmentRoutes"));
// app.use("/countries", require("./routes/countryRoutes"));

// Start the server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
