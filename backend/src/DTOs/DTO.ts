import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {validate, ValidationError} from 'class-validator';

export abstract class DTO {
    public async validate(): Promise<void> {
        const errors = await validate(this, {skipMissingProperties: true});

        if (this.errorsFound(errors)) {
            const errorMessage = errors.map(error => Object.values(error.constraints)).join(', ');
            throw new InvalidArgumentsError(errorMessage);
        }
    }

    private errorsFound(errors: ValidationError[]): boolean {
        return errors.length > 0;
    }
}