export class InvalidResourceStateError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidResourceStateError.prototype)
    }
}