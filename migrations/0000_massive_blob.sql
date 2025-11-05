CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"featured_image" text,
	"substack_embed_code" text,
	"tags" text[] DEFAULT '{}',
	"published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"services" text[] DEFAULT '{}' NOT NULL,
	"project_type" text NOT NULL,
	"location" text NOT NULL,
	"project_details" text NOT NULL,
	"timeline" text,
	"budget_range" text,
	"reference_files" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"sketchfab_model_id" text,
	"luma_embed_url" text,
	"polycam_embed_url" text,
	"model_file" text,
	"model_format" text,
	"video_file" text,
	"video_format" text,
	"category" text NOT NULL,
	"tools" text[] DEFAULT '{}',
	"services" text[] DEFAULT '{}',
	"featured_image" text,
	"images" text[] DEFAULT '{}',
	"published" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"company" text,
	"role" text,
	"rating" integer NOT NULL,
	"review_text" text NOT NULL,
	"project_type" text NOT NULL,
	"approved" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
