import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Language } from './Language';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private name: string;

  @Column()
  private email: string;

  @Column()
  private password: string;

  @Column()
  private city: string;

  constructor(name: string, email: string, password: string, city: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.city = city;
  };

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
