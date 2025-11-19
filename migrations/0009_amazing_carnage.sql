ALTER TABLE "survey_token" ALTER COLUMN "remaining_count" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "survey" ADD COLUMN "company_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "survey" ADD CONSTRAINT "survey_company_id_user_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;