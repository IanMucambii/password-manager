const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        iv: {
            type: String,
            required: true
        },

        authTag: {
            type: String,
            required: true
        },

        website: {
            type: String,
            trim: true
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Credential", credentialSchema);