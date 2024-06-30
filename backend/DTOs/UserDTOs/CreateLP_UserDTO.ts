import {IsString, IsNotEmpty, IsEmail} from 'class-validator';
import {DTO} from "../DTO";
import {LP_User} from "../../src/entity/LP_User/LP_User";
import {CreationDTO} from "../CreationDTO";


export class CreateLP_UserDTO extends DTO implements CreationDTO<LP_User> {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

    @IsString()
    @IsNotEmpty()
    public city: string;

    public toBusinessObject = async (): Promise<LP_User> => {
        await this.validate();

        const user = new LP_User(this.name, this.email, this.password, this.city);
        user.hashPassword();
        user.setDefaultProfilePicHash();

        return user;
    }
}