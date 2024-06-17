import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({ name: 'arrayStringNotEmpty', async: false })
export class ArrayStringNotEmptyConstraint implements ValidatorConstraintInterface {
    validate(array: string[], _args: ValidationArguments) {
        return array.every(str => typeof str === 'string' && str.trim().length > 0);
    }

    defaultMessage(_args: ValidationArguments) {
        return 'Each element in the array must be a non-empty string.';
    }
}