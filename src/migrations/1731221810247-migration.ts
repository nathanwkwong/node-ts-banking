import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1731221810247 implements MigrationInterface {
  name = 'Migration1731221810247'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" ADD "bankCode" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "account" ADD "branchCode" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08"`)
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountNumber"`)
    await queryRunner.query(`ALTER TABLE "account" ADD "accountNumber" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08" UNIQUE ("accountNumber")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08"`)
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountNumber"`)
    await queryRunner.query(`ALTER TABLE "account" ADD "accountNumber" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08" UNIQUE ("accountNumber")`
    )
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "branchCode"`)
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "bankCode"`)
  }
}
