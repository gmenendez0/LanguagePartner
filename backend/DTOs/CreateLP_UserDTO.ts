import {IsString, IsNotEmpty, IsEmail} from 'class-validator';
import {DTO} from "./DTO";
import {LP_User} from "../src/entity/User/LP_User";


export class CreateLP_UserDTO extends DTO<LP_User> {
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
        return user;
    }
}