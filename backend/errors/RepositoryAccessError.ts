export class RepositoryAccessError extends Error {
    constructor(messageDetail?: string) {
        super("Error accessing repository: " + messageDetail || "");
        Object.setPrototypeOf(this, RepositoryAccessError.prototype)
    }
}