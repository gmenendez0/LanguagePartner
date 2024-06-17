import {DTO} from "../DTO";
import {Language} from "../../src/entity/Language/Language";

export class LP_UserPublicDataDTO extends DTO {
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