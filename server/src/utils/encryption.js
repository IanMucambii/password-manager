const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Get encryption key from environment variables
 */
function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
        throw new Error("ENCRYPTION_KEY is not defined in .env");
    }

    const encryptionKey = Buffer.from(key, "hex");

    if (encryptionKey.length !== KEY_LENGTH) {
        throw new Error("ENCRYPTION_KEY must be exactly 32 bytes");
    }

    return encryptionKey;
}

/**
 * Encrypt plaintext
 */
function encrypt(text) {
    const key = getEncryptionKey();

    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
        encryptedData: encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex")
    };
}

/**
 * Decrypt encrypted data
 */
function decrypt(encryptedData, iv, authTag) {
    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};