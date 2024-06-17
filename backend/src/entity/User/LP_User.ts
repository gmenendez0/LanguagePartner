import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Language } from '../Language/Language';
import bcrypt from "bcrypt";
import {userApprovedUsersTableOptionsTableOptions, userMatchedUsersTableOptions, userKnownLanguagesTableOptions, userWantToKnowLanguagesTableOptions, userRejectedUsersTableOptionsTableOptions} from "./UserTableOptions";
import {CreateLP_UserDTO} from "../../../DTOs/UserDTOs/CreateLP_UserDTO";
import {plainToInstance} from "class-transformer";

@Entity()
export class LP_User{
    @PrimaryGeneratedColumn()
    private id: number;

    @Column()
    private readonly name: string;

    @Column()
    private readonly email: string;

    @Column()
    private password: string;

    @Column()
    private readonly city: string;

    @ManyToMany(() => LP_User)
    @JoinTable(userApprovedUsersTableOptionsTableOptions)
    private approvedUsers: LP_User[];

    @ManyToMany(() => LP_User)
    @JoinTable(userRejectedUsersTableOptionsTableOptions)
    private rejectedUsers: LP_User[];

    @ManyToMany(() => LP_User)
    @JoinTable(userMatchedUsersTableOptions)
    private matchedUsers: LP_User[];

    @ManyToMany(() => Language)
    @JoinTable(userKnownLanguagesTableOptions)
    private knownLanguages: Language[];

    @ManyToMany(() => Language)
    @JoinTable(userWantToKnowLanguagesTableOptions)
    private wantToKnowLanguages: Language[];

    @Column({ nullable: true })
    private profilePicHash: string;

    constructor(name: string, email: string, password: string, city: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.city = city;
    };

    public getId = (): number => this.id;

    public getName = (): string => this.name;

    public getEmail = (): string => this.email;

    public getPassword = (): string => this.password;

    public getCity = (): string => this.city;

    public getApprovedUsers = (): LP_User[] => this.approvedUsers;

    public getRejectedUsers = (): LP_User[] => this.rejectedUsers;

    public getMatchedUsers = (): LP_User[] => this.matchedUsers;

    public getKnownLanguages = (): Language[] => this.knownLanguages;

    public getWantToKnowLanguages = (): Language[] => this.wantToKnowLanguages;

    public getProfilePicHash = (): string => this.profilePicHash;

    public addApprovedUser = (user: LP_User): void => {
        this.approvedUsers.push(user);
    };

    public addRejectedUser = (user: LP_User): void => {
        this.rejectedUsers.push(user);
    };

    public addMatchedUser = (user: LP_User): void => {
        this.matchedUsers.push(user);
    };

    public addKnownLanguage = (language: Language): void => {
        this.knownLanguages.push(language);
    };

    public addWantToKnowLanguage = (language: Language): void => {
        this.wantToKnowLanguages.push(language);
    };

    public removeApprovedUser = (user: LP_User): void => {
        this.approvedUsers = this.approvedUsers.filter(approvedUser => approvedUser != user);
    };

    public removeRejectedUser = (user: LP_User): void => {
        this.rejectedUsers = this.rejectedUsers.filter(rejectedUser => rejectedUser != user);
    };

    public removeMatchedUser = (user: LP_User): void => {
        this.matchedUsers = this.matchedUsers.filter(matchedUser => matchedUser != user);
    };

    public removeKnownLanguage = (language: Language): void => {
        this.knownLanguages = this.knownLanguages.filter(knownLanguage => !knownLanguage.equals(language));
    };

    public removeWantToKnowLanguage = (language: Language): void => {
        this.wantToKnowLanguages = this.wantToKnowLanguages.filter(wantToKnowLanguage => !wantToKnowLanguage.equals(language));
    };

    /**
     * Checks if the provided string matches the hashed password stored in the object.
     * @param string - The string to compare with the hashed password.
     * @returns true if the provided string matches the hashed password, otherwise false.
     */
    public stringMatchesPassword = (string: string): boolean => {
        return bcrypt.compareSync(string, this.password);
    };

    /**
     * Hashes the password stored in the object.
     */
    public hashPassword = (): void => {
        this.password = this.hashString(this.password);
    }


    /**
     * Returns the hashed string.
     * @param string - The string to hash.
     * @returns  string as a hash.
     */
    private hashString = (string: string): string => {
        return bcrypt.hashSync(string, 10); //TODO Reemplazar 10 por una variable de entorno.
    };

    private getApprovedUsersIds = (): number[] => {
        if (!this.approvedUsers) return [];
        return this.approvedUsers.map(user => user.getId());
    }

    private getRejectedUsersIds = (): number[] => {
        if (!this.rejectedUsers) return [];
        return this.rejectedUsers.map(user => user.getId());
    }

    private getMatchedUsersIds = (): number[] => {
        if (!this.matchedUsers) return [];
        return this.matchedUsers.map(user => user.getId());
    }

    /**
     * Returns the safe exposable fields of LP_User.
     * @returns public exposable fields.
     */
    private asPublic = () => {
        return {
            name: this.name,
            email: this.email,
            city: this.city,
            profilePicHash: this.profilePicHash,
            knownLanguages: this.knownLanguages,
            wantToKnowLanguages: this.wantToKnowLanguages,
            approvedUsers: this.getApprovedUsersIds(),
            rejectedUsers: this.getRejectedUsersIds(),
            matchedUsers: this.getMatchedUsersIds(),
        }
    }

    /**
     * Returns the safe exposable fields of LP_User as a CreateLP_UserDTO object.
     * @returns public exposable fields as a CreateLP_UserDTO object
     * */
    public asPublicDTO = () => {
        return plainToInstance(CreateLP_UserDTO, this.asPublic());
    }
}
