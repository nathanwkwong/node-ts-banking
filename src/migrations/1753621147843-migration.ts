import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1753621147843 implements MigrationInterface {
  name = 'Migration1753621147843'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account_audit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fromStatus" "public"."account_audit_fromstatus_enum" NOT NULL, "toStatus" "public"."account_audit_tostatus_enum" NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" uuid, "changedById" uuid, CONSTRAINT "PK_2a504b11de85e11afc0cf36ced7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "account_audit" ADD CONSTRAINT "FK_2dfec5832fd406e25e83aa1f9d8" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "account_audit" ADD CONSTRAINT "FK_fd2ab3a17ddd0125f5dfaa3d585" FOREIGN KEY ("changedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account_audit" DROP CONSTRAINT "FK_fd2ab3a17ddd0125f5dfaa3d585"`)
    await queryRunner.query(`ALTER TABLE "account_audit" DROP CONSTRAINT "FK_2dfec5832fd406e25e83aa1f9d8"`)
    await queryRunner.query(`DROP TABLE "account_audit"`)
  }
}
