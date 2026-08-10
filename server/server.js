const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// --------------------
// Middleware
// --------------------

app.use(cors());
app.use(helmet());
app.use(express.json());

// --------------------
// Test Route
// --------------------

app.get("/", (req, res) => {
    res.json({
        message: "Password Manager API is running"
    });
});

// --------------------
// Start Server
// --------------------

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});