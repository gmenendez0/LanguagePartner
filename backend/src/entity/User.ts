import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Language } from './Language';
import bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    private id: number;

    @Column()
    private readonly name: string;

    @Column()
    private readonly email: string;

    @Column()
    private readonly password: string;

    @Column()
    private readonly city: string;

    constructor(name: string, email: string, password: string, city: string) {
    this.name = name;
    this.email = email;
    this.password = this.hashString(password);
    this.city = city;
    };

    public getId(): number {
    return this.id;
    };

    public getName(): string {
        return this.name;
    };

    public getEmail(): string {
        return this.email;
    };

    public getPassword(): string {
        return this.password;
    };

    public getCity(): string {
        return this.city;
    };

    public stringMatchesPassword(string: string): boolean {
        return bcrypt.compareSync(string, this.password);
    }

    //Post: Returns the hashed string.
    private hashString = (string: string) => {
        return bcrypt.hashSync(string, 10); //TODO Reemplazar 10 por una variable de entorno.
    }










  @ManyToMany(() => User)
  @JoinTable({
      name: 'user_approved_users', // Name of the join table
      joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
      },
      inverseJoinColumn: {
          name: 'approved_user_id',
          referencedColumnName: 'id',
      },
  })
  approvedUsers: User[];

  @ManyToMany(() => User)
  @JoinTable({
      name: 'user_rejected_users', // Name of the join table
      joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
      },
      inverseJoinColumn: {
          name: 'rejected_user_id',
          referencedColumnName: 'id',
      },
  })
  rejectedUsers: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_matched_users', // Name of the join table
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'matchedUserId',
        referencedColumnName: 'id',
    },
  })
  matchedUsers: User[];

  @ManyToMany(() => Language)
  @JoinTable({
    name: 'user_known_languages', // Name of the join table
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'languageId',
        referencedColumnName: 'id',
    },
  })
  knownLanguages: Language[];

  @ManyToMany(() => Language)
  @JoinTable({
    name: 'user_want_to_know_languages', // Name of the join table
    joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
    },
    inverseJoinColumn: {
        name: 'languageId',
        referencedColumnName: 'id',
    },
  })
  wantToKnowLanguages: Language[];

  @Column({ nullable: true })
  profilePicHash: string;
}
