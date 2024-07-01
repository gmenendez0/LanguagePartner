const PORT = process.env.PORT || 3000;
const SWAGGER_ENDPOINT = process.env.SWAGGER_ENDPOINT || '/api-docs';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const PASSPORT_AUTH_STRATEGY = process.env.PASSPORT_AUTH_STRATEGY || 'jwt';
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '1h';
const HASH_SALT_ROUNDS = process.env.HASH_SALT_ROUNDS || 10;
const DEFAULT_USER_PIC_HASH = process.env.DEFAULT_USER_PIC_HASH || 'JkzGSGZ';
const IMGUR_TOKEN = process.env.IMGUR_TOKEN || 'faf88da0b48658a09e9fce28e6659a3b7c2310ff';

export {
    PORT,
    SWAGGER_ENDPOINT,
    JWT_SECRET,
    PASSPORT_AUTH_STRATEGY,
    JWT_EXPIRATION_TIME,
    HASH_SALT_ROUNDS,
    DEFAULT_USER_PIC_HASH,
    IMGUR_TOKEN,
};