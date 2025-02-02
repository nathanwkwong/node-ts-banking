import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1733663549725 implements MigrationInterface {
  name = 'Migration1733663549725'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_7185cb5bc0826915be077f0d882"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ed3e32981d7a640be5480effecf"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_7185cb5bc0826915be077f0d882"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "receiverId"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_ed3e32981d7a640be5480effecf"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "senderId"`)
    await queryRunner.query(`ALTER TABLE "transaction" ADD "receiverAccountId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_ccb13651bc84ebbf68cd3e48699" UNIQUE ("receiverAccountId")`
    )
    await queryRunner.query(`ALTER TABLE "transaction" ADD "senderAccountId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_74b597aecea3f5052ae3d127da4" UNIQUE ("senderAccountId")`
    )
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
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_74b597aecea3f5052ae3d127da4"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "senderAccountId"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_ccb13651bc84ebbf68cd3e48699"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "receiverAccountId"`)
    await queryRunner.query(`ALTER TABLE "transaction" ADD "senderId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_ed3e32981d7a640be5480effecf" UNIQUE ("senderId")`
    )
    await queryRunner.query(`ALTER TABLE "transaction" ADD "receiverId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_7185cb5bc0826915be077f0d882" UNIQUE ("receiverId")`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ed3e32981d7a640be5480effecf" FOREIGN KEY ("senderId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_7185cb5bc0826915be077f0d882" FOREIGN KEY ("receiverId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
