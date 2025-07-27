import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1733663318229 implements MigrationInterface {
  name = 'Migration1733663318229'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_currency_enum" AS ENUM('HKD', 'USD', 'CNY', 'EUR', 'GBP')`
    )
    await queryRunner.query(`ALTER TABLE "transaction" ADD "currency" "public"."transaction_currency_enum" NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "currency"`)
    await queryRunner.query(`DROP TYPE "public"."transaction_currency_enum"`)
  }
}
