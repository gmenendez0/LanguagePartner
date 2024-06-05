import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Language {
    @PrimaryGeneratedColumn()
    private id: number;

    @Column()
    private readonly name: string;

    constructor(name: string) {
      this.name = name;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }
}
