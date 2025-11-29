CREATE TYPE "public"."consent_type" AS ENUM('terms_of_service', 'privacy_policy', 'data_processing', 'marketing', 'analytics', 'third_party_sharing');--> statement-breakpoint
CREATE TYPE "public"."petition_status" AS ENUM('rascunho', 'finalizada');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "petitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"template_type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"numero_processo" varchar(100),
	"tribunal" varchar(255),
	"autor" varchar(255),
	"reu" varchar(255),
	"fatos" text,
	"fundamentos_juridicos" text,
	"pedidos" text,
	"valor_causa" varchar(50),
	"status" "petition_status" DEFAULT 'rascunho' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_consents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"consent_type" "consent_type" NOT NULL,
	"granted" boolean NOT NULL,
	"version" varchar(20) NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(500),
	"granted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"open_id" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"login_method" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_signed_in" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_open_id_unique" UNIQUE("open_id")
);
--> statement-breakpoint
ALTER TABLE "petitions" ADD CONSTRAINT "petitions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_petitions_user_id" ON "petitions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_petitions_status" ON "petitions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_petitions_template_type" ON "petitions" USING btree ("template_type");--> statement-breakpoint
CREATE INDEX "idx_petitions_user_status" ON "petitions" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "idx_petitions_updated_at" ON "petitions" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_user_consents_user_id" ON "user_consents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_consents_type" ON "user_consents" USING btree ("consent_type");--> statement-breakpoint
CREATE INDEX "idx_user_consents_user_type" ON "user_consents" USING btree ("user_id","consent_type");