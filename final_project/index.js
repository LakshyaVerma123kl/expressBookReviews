const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
require("dotenv").config(); // Load environment variables from .env file

const app = express();

app.use(express.json());

// Configure session middleware
app.use(
  "/customer",
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Use environment variable for secret
    resave: true,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }, // Secure cookies in production
  })
);

// Authentication middleware for /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.accessToken) {
    const token = req.session.accessToken;

    // Verify the token using JWT
    jwt.verify(
      token,
      process.env.JWT_SECRET || "default_jwt_secret",
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }

        // Token is valid, attach the decoded user information to the request object
        req.user = decoded;
        next();
      }
    );
  } else {
    // No token found in the session
    res.status(401).json({ message: "No access token provided" });
  }
});

const PORT = process.env.PORT || 5000; // Use environment variable for port

// Route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
