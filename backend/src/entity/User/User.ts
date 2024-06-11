import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Language } from '../Language/Language';
import bcrypt from "bcrypt";
import {userApprovedUsersTableOptionsTableOptions, userMatchedUsersTableOptions, userKnownLanguagesTableOptions, userWantToKnowLanguagesTableOptions, userRejectedUsersTableOptionsTableOptions} from "./UserTableOptions";

@Entity()
export class User {
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

    @ManyToMany(() => User)
    @JoinTable(userApprovedUsersTableOptionsTableOptions)
    private approvedUsers: User[];

    @ManyToMany(() => User)
    @JoinTable(userRejectedUsersTableOptionsTableOptions)
    private rejectedUsers: User[];

    @ManyToMany(() => User)
    @JoinTable(userMatchedUsersTableOptions)
    private matchedUsers: User[];

    @ManyToMany(() => Language)
    @JoinTable(userKnownLanguagesTableOptions)
    private knownLanguages: Language[];

    @ManyToMany(() => Language)
    @JoinTable(userWantToKnowLanguagesTableOptions)
    private wantToKnowLanguages: Language[];

    @Column({ nullable: true })
    profilePicHash: string;

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

    public getApprovedUsers = (): User[] => this.approvedUsers;

    public getRejectedUsers = (): User[] => this.rejectedUsers;

    public getMatchedUsers = (): User[] => this.matchedUsers;

    public getKnownLanguages = (): Language[] => this.knownLanguages;

    public getWantToKnowLanguages = (): Language[] => this.wantToKnowLanguages;

    public getProfilePicHash = (): string => this.profilePicHash;

    public addApprovedUser = (user: User): void => {
        this.approvedUsers.push(user);
    };

    public addRejectedUser = (user: User): void => {
        this.rejectedUsers.push(user);
    };

    public addMatchedUser = (user: User): void => {
        this.matchedUsers.push(user);
    };

    public addKnownLanguage = (language: Language): void => {
        this.knownLanguages.push(language);
    };

    public addWantToKnowLanguage = (language: Language): void => {
        this.wantToKnowLanguages.push(language);
    };

    public removeApprovedUser = (user: User): void => {
        this.approvedUsers = this.approvedUsers.filter(approvedUser => approvedUser !== user);
    };

    public removeRejectedUser = (user: User): void => {
        this.rejectedUsers = this.rejectedUsers.filter(rejectedUser => rejectedUser !== user);
    };

    public removeMatchedUser = (user: User): void => {
        this.matchedUsers = this.matchedUsers.filter(matchedUser => matchedUser !== user);
    };

    public removeKnownLanguage = (language: Language): void => {
        this.knownLanguages = this.knownLanguages.filter(knownLanguage => knownLanguage !== language);
    };

    public removeWantToKnowLanguage = (language: Language): void => {
        this.wantToKnowLanguages = this.wantToKnowLanguages.filter(wantToKnowLanguage => wantToKnowLanguage !== language);
    };

    public stringMatchesPassword = (string: string): boolean => {
        return bcrypt.compareSync(string, this.password);
    };

    public hashPassword = (): void => {
        this.password = this.hashString(this.password);
    }

    //Post: Returns the hashed string.
    private hashString = (string: string): string => {
        return bcrypt.hashSync(string, 10); //TODO Reemplazar 10 por una variable de entorno.
    };
}
