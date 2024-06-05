export class AuthenticationError extends Error {
    constructor() {
        super("Internal error during authentication.");
        Object.setPrototypeOf(this, AuthenticationError.prototype)
    }
}