const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://express-js-react-js-mysql-323h.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

module.exports = corsMiddleware;