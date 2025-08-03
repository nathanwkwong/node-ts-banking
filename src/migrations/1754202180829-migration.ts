import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1754202180829 implements MigrationInterface {
  name = 'Migration1754202180829'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "authentication_audit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventType" character varying NOT NULL, "attemptedUsername" character varying, "isSuccess" boolean NOT NULL, "failureReason" character varying, "tokenHash" character varying, "ipAddress" character varying NOT NULL, "forwardedIps" text, "userAgent" character varying NOT NULL, "location" character varying, "deviceType" character varying NOT NULL, "browserName" character varying NOT NULL, "browserVersion" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "retentionDays" integer NOT NULL DEFAULT '2555', "userId" uuid, CONSTRAINT "PK_614d8d47f180d63d08795d42214" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "authentication_audit" ADD CONSTRAINT "FK_64b5d793366b1407363af52b896" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "authentication_audit" DROP CONSTRAINT "FK_64b5d793366b1407363af52b896"`)
    await queryRunner.query(`DROP TABLE "authentication_audit"`)
  }
}
