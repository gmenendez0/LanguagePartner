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

    public getName(): string {
        return this.name;
    }

    public equals = (language: Language): boolean => {
        return this.id === language.id;
    }
}
