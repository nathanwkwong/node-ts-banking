import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1730612968032 implements MigrationInterface {
  name = 'Migration1730612968032'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."account_currency_enum" AS ENUM('HKD', 'USD', 'CNY', 'EUR', 'GBP')`)
    await queryRunner.query(
      `ALTER TABLE "account" ADD "currency" "public"."account_currency_enum" NOT NULL DEFAULT 'HKD'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "currency"`)
    await queryRunner.query(`DROP TYPE "public"."account_currency_enum"`)
  }
}
