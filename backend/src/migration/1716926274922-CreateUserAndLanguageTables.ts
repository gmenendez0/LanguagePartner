import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserAndLanguageTables1716926274922 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the Language table
        await queryRunner.createTable(new Table({
            name: 'language',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: false,
                },
            ],
        }), true);

        // Create the LP_User table
        await queryRunner.createTable(new Table({
            name: 'lp_user',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'city',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'profilePicHash',
                    type: 'varchar',
                    isNullable: true,
                },
            ],
        }), true);

        // Create the many-to-many relationships between LP_User and LP_User
        await queryRunner.createTable(new Table({
            name: 'user_approved_users',
            columns: [
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'approvedUserId',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['approvedUserId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: 'user_rejected_users',
            columns: [
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'rejectedUserId',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['rejectedUserId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: 'user_matched_users',
            columns: [
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'matchedUserId',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['matchedUserId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }), true);

        // Create the many-to-many relationships between LP_User and Language
        await queryRunner.createTable(new Table({
            name: 'user_known_languages',
            columns: [
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'languageId',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['languageId'],
                    referencedTableName: 'language',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: 'user_want_to_know_languages',
            columns: [
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'languageId',
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'lp_user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
                {
                    columnNames: ['languageId'],
                    referencedTableName: 'language',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_want_to_know_languages');
        await queryRunner.dropTable('user_known_languages');
        await queryRunner.dropTable('user_matched_users');
        await queryRunner.dropTable('user_rejected_users');
        await queryRunner.dropTable('user_approved_users');
        await queryRunner.dropTable('lp_user');
        await queryRunner.dropTable('language');
    }
}
