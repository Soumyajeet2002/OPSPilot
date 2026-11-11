import {
    MigrationInterface,
    QueryRunner,
  } from 'typeorm';
  
  export class CreateAuthTables1731150000000
    implements MigrationInterface
  {
    name = 'CreateAuthTables1731150000000';
  
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TYPE "users_status_enum"
        AS ENUM ('ACTIVE', 'DISABLED', 'SUSPENDED')
      `);
  
      await queryRunner.query(`
        CREATE TABLE "users" (
          "id" uuid NOT NULL DEFAULT gen_random_uuid(),
          "email" varchar(255) NOT NULL,
          "password_hash" varchar NOT NULL,
          "first_name" varchar(100) NOT NULL,
          "last_name" varchar(100) NOT NULL,
          "status" "users_status_enum" NOT NULL DEFAULT 'ACTIVE',
          "created_at" timestamptz NOT NULL DEFAULT now(),
          "updated_at" timestamptz NOT NULL DEFAULT now(),
          CONSTRAINT "PK_users" PRIMARY KEY ("id"),
          CONSTRAINT "UQ_users_email" UNIQUE ("email")
        )
      `);
  
      await queryRunner.query(`
        CREATE TABLE "refresh_tokens" (
          "id" uuid NOT NULL DEFAULT gen_random_uuid(),
          "user_id" uuid NOT NULL,
          "token_hash" varchar(64) NOT NULL,
          "remember_me" boolean NOT NULL DEFAULT false,
          "expires_at" timestamptz NOT NULL,
          "revoked_at" timestamptz,
          "created_at" timestamptz NOT NULL DEFAULT now(),
          CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
          CONSTRAINT "UQ_refresh_tokens_hash" UNIQUE ("token_hash"),
          CONSTRAINT "FK_refresh_tokens_user"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        )
      `);
  
      await queryRunner.query(`
        CREATE INDEX "IDX_refresh_tokens_user_id"
        ON "refresh_tokens" ("user_id")
      `);
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        DROP TABLE "refresh_tokens"
      `);
  
      await queryRunner.query(`
        DROP TABLE "users"
      `);
  
      await queryRunner.query(`
        DROP TYPE "users_status_enum"
      `);
    }
  }