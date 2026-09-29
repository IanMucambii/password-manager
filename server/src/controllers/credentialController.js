const Credential = require("../models/credentials");
const { encrypt, decrypt } = require("../utils/encryption");

const createCredential = async (req, res) => {
    try {
        const {
            title,
            username,
            password,
            website,
            notes
        } = req.body;

        if (!title || !username || !password) {
            return res.status(400).json({
                message: "Title, username and password are required"
            });
        }

        const encrypted = encrypt(password);

        const credential = await Credential.create({
            user: req.user.userId,
            title,
            username,
            password: encrypted.encryptedData,
            website,
            notes,
            iv: encrypted.iv,
            authTag: encrypted.authTag
        });

        return res.status(201).json({
            message: "Credential created successfully",
            credential: {
                id: credential._id,
                title: credential.title,
                username: credential.username,
                website: credential.website,
                notes: credential.notes,
                createdAt: credential.createdAt
            }
        });

    } catch (error) {
        console.error("Create credential error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find({
            user: req.user.userId
        });

        const decryptedCredentials = credentials.map((credential) => {
            const decryptedPassword = decrypt(
                credential.password,
                credential.iv,
                credential.authTag
            );

            return {
                id: credential._id,
                title: credential.title,
                username: credential.username,
                password: decryptedPassword,
                website: credential.website,
                notes: credential.notes,
                createdAt: credential.createdAt,
                updatedAt: credential.updatedAt
            };
        });

        return res.status(200).json({
            message: "Credentials retrieved successfully",
            credentials: decryptedCredentials
        });

    } catch (error) {
        console.error("Get credentials error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updateCredential = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            username,
            password,
            website,
            notes
        } = req.body;

        const credential = await Credential.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!credential) {
            return res.status(404).json({
                message: "Credential not found"
            });
        }

        if (title !== undefined) {
            credential.title = title;
        }

        if (username !== undefined) {
            credential.username = username;
        }

        if (website !== undefined) {
            credential.website = website;
        }

        if (notes !== undefined) {
            credential.notes = notes;
        }

        if (password !== undefined) {
            const encrypted = encrypt(password);

            credential.password = encrypted.encryptedData;
            credential.iv = encrypted.iv;
            credential.authTag = encrypted.authTag;
        }

        await credential.save();

        return res.status(200).json({
            message: "Credential updated successfully",
            credential: {
                id: credential._id,
                title: credential.title,
                username: credential.username,
                website: credential.website,
                notes: credential.notes,
                updatedAt: credential.updatedAt
            }
        });

    } catch (error) {
        console.error("Update credential error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteCredential = async (req, res) => {
    try {
        const { id } = req.params;

        const credential = await Credential.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!credential) {
            return res.status(404).json({
                message: "Credential not found"
            });
        }

        await Credential.deleteOne({
            _id: id,
            user: req.user.userId
        });

        return res.status(200).json({
            message: "Credential deleted successfully"
        });

    } catch (error) {
        console.error("Delete credential error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createCredential,
    getCredentials,
    updateCredential,
    deleteCredential
};