import {DTO} from "../DTO";
import {Language} from "../../entity/Language/Language";

export class LP_UserPublicDataDTO extends DTO {
    public id: number;

    public name: string;

    public email: string;

    public city: string;

    public profilePicHash: string;

    public knownLanguages: Language[];

    public wantToKnowLanguages: Language[];

    public approvedUsers: number[];

    public rejectedUsers: number[];

    public matchedUsers: number[];
}