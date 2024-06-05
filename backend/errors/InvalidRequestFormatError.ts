export class InvalidRequestFormatError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidRequestFormatError.prototype)
    }
}