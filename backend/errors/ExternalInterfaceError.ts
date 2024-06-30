export class ExternalInterfaceError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ExternalInterfaceError.prototype)
    }
}