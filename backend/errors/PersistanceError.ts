export class PersistanceError extends Error {
    constructor(messageDetail?: string) {
        super("Error persisting data: " + messageDetail || "");
        Object.setPrototypeOf(this, PersistanceError.prototype)
    }
}