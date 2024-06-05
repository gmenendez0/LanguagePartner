export class InvalidArgumentsError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidArgumentsError.prototype)
    }
}