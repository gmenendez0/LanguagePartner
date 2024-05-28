import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserrTable1716926274921 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "userr"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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

}
