import {DTO} from "../DTO";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class LogInDTO extends DTO {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}