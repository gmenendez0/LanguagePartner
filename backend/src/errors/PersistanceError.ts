export class PersistanceError extends Error {
    constructor() {
        super("Error persisting data.");
        Object.setPrototypeOf(this, PersistanceError.prototype)
    }
}