const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createCredential,
    getCredentials,
    updateCredential,
    deleteCredential
} = require("../controllers/credentialController");


router.post("/", authMiddleware, createCredential);

router.get("/", authMiddleware, getCredentials);

router.put("/:id", authMiddleware, updateCredential);

router.delete("/:id", authMiddleware, deleteCredential);


module.exports = router;