const ERROR_MESSAGE = "Error persisting data.";

export class PersistanceError extends Error {
    constructor() {
        super(ERROR_MESSAGE);
    }
}