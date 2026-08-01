CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" varchar(500),
	"estimated_minutes" integer,
	"project" varchar(255),
	"order" integer NOT NULL,
	"status" varchar(20) DEFAULT 'locked',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "description" varchar(500);--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "estimated_days" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "status" varchar(20) DEFAULT 'locked';--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "current_module" uuid;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_roadmap_id_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE cascade ON UPDATE no action;