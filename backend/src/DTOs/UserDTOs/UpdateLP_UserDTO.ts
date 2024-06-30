import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {DTO} from "../DTO";
import {InvalidArgumentsError} from "../../errors/InvalidArgumentsError";

export class UpdateLP_UserPublicDataDTO extends DTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    public city: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public knownLanguages: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public wantToKnowLanguages: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public knownLanguagesToRemove: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public knownLanguagesToAdd: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public wantToKnowLanguagesToRemove: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public wantToKnowLanguagesToAdd: string[];

    public async validate(): Promise<void> {
        await super.validate();
        if (this.noFieldsFilled()) throw new InvalidArgumentsError('At least one field must be filled.');
    }

    private noFieldsFilled(): boolean {
        return !this.name && !this.city
            && !this.knownLanguagesToAdd && !this.wantToKnowLanguages
            && !this.knownLanguagesToRemove && !this.wantToKnowLanguagesToAdd
            && !this.wantToKnowLanguagesToRemove && !this.knownLanguages;
    }
}