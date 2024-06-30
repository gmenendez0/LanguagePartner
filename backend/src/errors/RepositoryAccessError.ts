export class RepositoryAccessError extends Error {
    constructor() {
        super("Error accessing repository.");
        Object.setPrototypeOf(this, RepositoryAccessError.prototype)
    }
}