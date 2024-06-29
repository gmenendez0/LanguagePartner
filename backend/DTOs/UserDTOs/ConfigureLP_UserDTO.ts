import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {DTO} from "../DTO";

export class ConfigureLP_UserDTO extends DTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    public profilePicHash: string;

    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public knownLanguages: string[];

    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public wantToKnowLanguages: string[];
}