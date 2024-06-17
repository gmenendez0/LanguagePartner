import {DTO} from "../DTO";
import {ArrayMinSize, ArrayNotEmpty, IsArray, Validate} from "class-validator";
import {ArrayStringNotEmptyConstraint} from "../Validators/CustomValidations";

export class LanguagesDTO extends DTO{
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @Validate(ArrayStringNotEmptyConstraint)
    public languageNames: string[];
}