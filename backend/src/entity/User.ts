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
  @JoinTable()
  matchedUsers: User[];

  @ManyToMany(() => Language)
  @JoinTable()
  knownLanguages: Language[];

  @ManyToMany(() => Language)
  @JoinTable()
  wantToKnowLanguages: Language[];

  @Column({ nullable: true })
  profilePicHash: string;
}
