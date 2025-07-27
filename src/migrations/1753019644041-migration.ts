import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1753019644041 implements MigrationInterface {
  name = 'Migration1753019644041'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transactionType"`)
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_transactiontype_enum" AS ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER')`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transactionType" "public"."transaction_transactiontype_enum" NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "status"`)
    await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED')`)
    await queryRunner.query(`ALTER TABLE "transaction" ADD "status" "public"."transaction_status_enum" NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`)
    await queryRunner.query(`ALTER TABLE "transaction" ADD "status" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transactionType"`)
    await queryRunner.query(`DROP TYPE "public"."transaction_transactiontype_enum"`)
    await queryRunner.query(`ALTER TABLE "transaction" ADD "transactionType" character varying NOT NULL`)
  }
}
