import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1733660515277 implements MigrationInterface {
  name = 'Migration1733660515277'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_3d6e89b14baa44a71870450d14d"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "accountId"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "accountId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3d6e89b14baa44a71870450d14d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
