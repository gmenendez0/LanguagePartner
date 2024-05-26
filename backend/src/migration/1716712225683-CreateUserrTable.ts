import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserrTable1716712225683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "userr" (
                "id" SERIAL NOT NULL PRIMARY KEY,
                "firstName" VARCHAR NOT NULL,
                "lastName" VARCHAR NOT NULL,
                "age" INTEGER NOT NULL,
                "age2" INTEGER NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "userr"`);
    }

}
