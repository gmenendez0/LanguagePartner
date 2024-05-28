import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Language } from './Language';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  city: string;

  @ManyToMany(() => User)
  @JoinTable()
  approvedUsers: User[];

  @ManyToMany(() => User)
  @JoinTable()
  rejectedUsers: User[];

  @ManyToMany(() => User)
  @JoinTable()
  matchedUsers: User[];

  @ManyToMany(() => Language)
  @JoinTable()
  knownLanguages: Language[];

  @ManyToMany(() => Language)
  @JoinTable()
  wantToKnowLanguages: Language[];

  @Column()
  profilePicHash: string;
}
