import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1754203718108 implements MigrationInterface {
  name = 'Migration1754203718108'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "authentication_audit" ADD "sessionExpiredAt" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "authentication_audit" DROP COLUMN "sessionExpiredAt"`)
  }
}
