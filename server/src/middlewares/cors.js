const cors = require("cors");

const allowedOrigins = [
  "https://express-js-react-js-mysql-323h.vercel.app/",
  "http://localhost:3000",
  "http://localhost:5173",
];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    // such as curl/Postman/server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: false,
});

module.exports = corsMiddleware;