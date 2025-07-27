import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1733661511342 implements MigrationInterface {
  name = 'Migration1733661511342'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "receiverId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_7185cb5bc0826915be077f0d882" UNIQUE ("receiverId")`
    )
    await queryRunner.query(`ALTER TABLE "transaction" ADD "senderId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_ed3e32981d7a640be5480effecf" UNIQUE ("senderId")`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_7185cb5bc0826915be077f0d882" FOREIGN KEY ("receiverId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ed3e32981d7a640be5480effecf" FOREIGN KEY ("senderId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ed3e32981d7a640be5480effecf"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_7185cb5bc0826915be077f0d882"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_ed3e32981d7a640be5480effecf"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "senderId"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_7185cb5bc0826915be077f0d882"`)
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "receiverId"`)
  }
}
