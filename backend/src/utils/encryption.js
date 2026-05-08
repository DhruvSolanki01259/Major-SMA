import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

export const encryptToken = (text) => {
  if (!text) return null;
  
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || encryptionKey.length !== 32) {
    throw new Error('Encryption key must be 32 characters long');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  const key = crypto.pbkdf2Sync(encryptionKey, salt, ITERATIONS, KEY_LENGTH, 'sha512');

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

export const decryptToken = (encryptedData) => {
  if (!encryptedData) return null;

  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || encryptionKey.length !== 32) {
    throw new Error('Encryption key must be 32 characters long');
  }

  const bData = Buffer.from(encryptedData, 'base64');

  const salt = bData.subarray(0, SALT_LENGTH);
  const iv = bData.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = bData.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = bData.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = crypto.pbkdf2Sync(encryptionKey, salt, ITERATIONS, KEY_LENGTH, 'sha512');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted, 'binary', 'utf8') + decipher.final('utf8');
};
