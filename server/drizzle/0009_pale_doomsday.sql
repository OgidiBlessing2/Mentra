ALTER TABLE "quiz_results" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_user_unique" UNIQUE("quiz_id","user_id");