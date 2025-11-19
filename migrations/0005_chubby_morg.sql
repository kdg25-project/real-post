CREATE TABLE "survey_token" (
	"id" uuid PRIMARY KEY NOT NULL,
	"survey_id" uuid NOT NULL,
	"token" text NOT NULL,
	"remaining_count" integer NOT NULL,
	"expired_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "survey_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "survey_token" ADD CONSTRAINT "survey_token_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE cascade ON UPDATE no action;