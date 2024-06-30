import {IsArray, IsNotEmpty, IsString} from "class-validator";
import {DTO} from "../DTO";

export class ConfigureLP_UserDTO extends DTO {
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public knownLanguages: string[];

    @IsArray()
    @IsString({each: true})
    @IsNotEmpty({each: true})
    public wantToKnowLanguages: string[];
}