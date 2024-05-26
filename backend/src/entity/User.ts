import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Userr {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

    @Column()
    age2: number

}
