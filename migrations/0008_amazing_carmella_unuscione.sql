ALTER TABLE "survey_token" RENAME COLUMN "survey_id" TO "company_id";--> statement-breakpoint
ALTER TABLE "survey_token" DROP CONSTRAINT "survey_token_survey_id_survey_id_fk";
--> statement-breakpoint
ALTER TABLE "survey_token" ADD CONSTRAINT "survey_token_company_id_user_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;