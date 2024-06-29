import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsConfiguredToUserTable1716926274923 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('lp_user', new TableColumn({
            name: 'is_configured',
            type: 'boolean',
            isNullable: false,
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('lp_user', 'is_configured');
    }
}