import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {DTO} from "../DTO";
import {InvalidArgumentsError} from "../../errors/InvalidArgumentsError";

export class UpdateLPUserPublicDataDTO extends DTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    public city: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    public profilePicHash: string;

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
        if (!this.name && !this.city && !this.profilePicHash && !this.knownLanguagesToAdd && !this.knownLanguagesToRemove && !this.wantToKnowLanguagesToAdd && !this.wantToKnowLanguagesToRemove)
            throw new InvalidArgumentsError('At least one field must be filled.');
    }
}