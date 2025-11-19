-- Safe UUID migration: create extension and migrate text id columns to uuid
-- This migration avoids direct CAST which fails when existing ids are not UUIDs.

BEGIN;

-- enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Rename survey column
ALTER TABLE "survey" RENAME COLUMN "ageGroup" TO "age_group";

-- Add new uuid columns for primary keys
ALTER TABLE "user" ADD COLUMN id_new uuid DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "account" ADD COLUMN id_new uuid DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "company_profile" ADD COLUMN id_new uuid DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "session" ADD COLUMN id_new uuid DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "user_profile" ADD COLUMN id_new uuid DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "verification" ADD COLUMN id_new uuid DEFAULT gen_random_uuid() NOT NULL;

-- Add new uuid columns for foreign keys
ALTER TABLE "account" ADD COLUMN user_id_new uuid;
ALTER TABLE "company_profile" ADD COLUMN user_id_new uuid;
ALTER TABLE "session" ADD COLUMN user_id_new uuid;
ALTER TABLE "user_profile" ADD COLUMN user_id_new uuid;
ALTER TABLE "favorite" ADD COLUMN user_id_new uuid;
ALTER TABLE "goods" ADD COLUMN company_id_new uuid;

-- Populate new fk/id mappings
UPDATE "user" SET id_new = gen_random_uuid() WHERE id_new IS NULL;
UPDATE "account" SET id_new = gen_random_uuid() WHERE id_new IS NULL;
UPDATE "company_profile" SET id_new = gen_random_uuid() WHERE id_new IS NULL;
UPDATE "session" SET id_new = gen_random_uuid() WHERE id_new IS NULL;
UPDATE "user_profile" SET id_new = gen_random_uuid() WHERE id_new IS NULL;
UPDATE "verification" SET id_new = gen_random_uuid() WHERE id_new IS NULL;

UPDATE "account" SET user_id_new = u.id_new FROM "user" u WHERE "account"."user_id" = u.id;
UPDATE "company_profile" SET user_id_new = u.id_new FROM "user" u WHERE "company_profile"."user_id" = u.id;
UPDATE "session" SET user_id_new = u.id_new FROM "user" u WHERE "session"."user_id" = u.id;
UPDATE "user_profile" SET user_id_new = u.id_new FROM "user" u WHERE "user_profile"."user_id" = u.id;
UPDATE "favorite" SET user_id_new = u.id_new FROM "user" u WHERE "favorite"."user_id" = u.id;
UPDATE "goods" SET company_id_new = u.id_new FROM "user" u WHERE "goods"."company_id" = u.id;

-- Drop existing foreign key constraints that reference user ids
ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_user_id_user_id_fk";
ALTER TABLE "company_profile" DROP CONSTRAINT IF EXISTS "company_profile_user_id_user_id_fk";
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_user_id_fk";
ALTER TABLE "user_profile" DROP CONSTRAINT IF EXISTS "user_profile_user_id_user_id_fk";
ALTER TABLE "favorite" DROP CONSTRAINT IF EXISTS "favorite_user_id_user_id_fk";
ALTER TABLE "goods" DROP CONSTRAINT IF EXISTS "goods_company_id_user_id_fk";

-- Drop primary key constraints (default names used by Postgres)
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_pkey";
ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_pkey";
ALTER TABLE "company_profile" DROP CONSTRAINT IF EXISTS "company_profile_pkey";
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_pkey";
ALTER TABLE "user_profile" DROP CONSTRAINT IF EXISTS "user_profile_pkey";
ALTER TABLE "verification" DROP CONSTRAINT IF EXISTS "verification_pkey";

-- Drop old id / fk columns
ALTER TABLE "account" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "company_profile" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "session" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "user_profile" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "favorite" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "goods" DROP COLUMN IF EXISTS "company_id";

ALTER TABLE "account" DROP COLUMN IF EXISTS "id";
ALTER TABLE "company_profile" DROP COLUMN IF EXISTS "id";
ALTER TABLE "session" DROP COLUMN IF EXISTS "id";
ALTER TABLE "user" DROP COLUMN IF EXISTS "id";
ALTER TABLE "user_profile" DROP COLUMN IF EXISTS "id";
ALTER TABLE "verification" DROP COLUMN IF EXISTS "id";

-- Rename new columns to final names
ALTER TABLE "user" RENAME COLUMN id_new TO id;
ALTER TABLE "account" RENAME COLUMN id_new TO id;
ALTER TABLE "company_profile" RENAME COLUMN id_new TO id;
ALTER TABLE "session" RENAME COLUMN id_new TO id;
ALTER TABLE "user_profile" RENAME COLUMN id_new TO id;
ALTER TABLE "verification" RENAME COLUMN id_new TO id;

ALTER TABLE "account" RENAME COLUMN user_id_new TO user_id;
ALTER TABLE "company_profile" RENAME COLUMN user_id_new TO user_id;
ALTER TABLE "session" RENAME COLUMN user_id_new TO user_id;
ALTER TABLE "user_profile" RENAME COLUMN user_id_new TO user_id;
ALTER TABLE "favorite" RENAME COLUMN user_id_new TO user_id;
ALTER TABLE "goods" RENAME COLUMN company_id_new TO company_id;

-- Recreate primary keys
ALTER TABLE "user" ADD PRIMARY KEY (id);
ALTER TABLE "account" ADD PRIMARY KEY (id);
ALTER TABLE "company_profile" ADD PRIMARY KEY (id);
ALTER TABLE "session" ADD PRIMARY KEY (id);
ALTER TABLE "user_profile" ADD PRIMARY KEY (id);
ALTER TABLE "verification" ADD PRIMARY KEY (id);

-- Ensure default generation for ids
ALTER TABLE "user" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "account" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "company_profile" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "session" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "user_profile" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "verification" ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Recreate foreign key constraints
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade;
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade;
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade;
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade;
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade;
ALTER TABLE "goods" ADD CONSTRAINT "goods_company_id_user_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."user"("id") ON DELETE cascade;

COMMIT;