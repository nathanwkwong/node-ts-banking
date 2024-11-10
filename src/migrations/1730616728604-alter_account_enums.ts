import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1730616728604 implements MigrationInterface {
  name = 'Migration1730616728604'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08"`)
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountNumber"`)
    await queryRunner.query(`ALTER TABLE "account" ADD "accountNumber" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08" UNIQUE ("accountNumber")`
    )
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountType"`)
    await queryRunner.query(
      `CREATE TYPE "public"."account_accounttype_enum" AS ENUM('SAVING', 'CHEQUE', 'CREDIT', 'TIME_DEPOSIT')`
    )
    await queryRunner.query(
      `ALTER TABLE "account" ADD "accountType" "public"."account_accounttype_enum" NOT NULL DEFAULT 'SAVING'`
    )
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "status"`)
    await queryRunner.query(
      `CREATE TYPE "public"."account_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED')`
    )
    await queryRunner.query(
      `ALTER TABLE "account" ADD "status" "public"."account_status_enum" NOT NULL DEFAULT 'ACTIVE'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."account_status_enum"`)
    await queryRunner.query(`ALTER TABLE "account" ADD "status" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountType"`)
    await queryRunner.query(`DROP TYPE "public"."account_accounttype_enum"`)
    await queryRunner.query(`ALTER TABLE "account" ADD "accountType" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08"`)
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountNumber"`)
    await queryRunner.query(`ALTER TABLE "account" ADD "accountNumber" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08" UNIQUE ("accountNumber")`
    )
  }
}
