import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1753021727530 implements MigrationInterface {
  name = 'Migration1753021727530'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ccb13651bc84ebbf68cd3e48699"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_74b597aecea3f5052ae3d127da4"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_ccb13651bc84ebbf68cd3e48699"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_74b597aecea3f5052ae3d127da4"`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ccb13651bc84ebbf68cd3e48699" FOREIGN KEY ("receiverAccountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_74b597aecea3f5052ae3d127da4" FOREIGN KEY ("senderAccountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_74b597aecea3f5052ae3d127da4"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ccb13651bc84ebbf68cd3e48699"`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_74b597aecea3f5052ae3d127da4" UNIQUE ("senderAccountId")`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_ccb13651bc84ebbf68cd3e48699" UNIQUE ("receiverAccountId")`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_74b597aecea3f5052ae3d127da4" FOREIGN KEY ("senderAccountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ccb13651bc84ebbf68cd3e48699" FOREIGN KEY ("receiverAccountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
