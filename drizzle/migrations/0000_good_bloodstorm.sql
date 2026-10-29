CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('SUPER_ADMIN','EDITOR') NOT NULL DEFAULT 'EDITOR',
	`is_active` boolean NOT NULL DEFAULT true,
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`issuer` varchar(255),
	`registration_number` varchar(255),
	`logo_url` varchar(1000),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `credentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_checklists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('ITR','GST_REGISTRATION','GST_RETURNS') NOT NULL,
	`item_text` text NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `document_checklists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` enum('general','insurance','itr','gst','investments') NOT NULL DEFAULT 'general',
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_slides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`highlight_text` varchar(255) NOT NULL,
	`subtitle` text NOT NULL,
	`image_url` varchar(1000),
	`cta_label` varchar(100) DEFAULT 'Start a conversation',
	`cta_link` varchar(255) DEFAULT '/contact',
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_slides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(255),
	`service_interest` varchar(255),
	`message` text,
	`source` enum('CONTACT_FORM','INSURANCE_ADVISOR','WHATSAPP_CLICK') NOT NULL DEFAULT 'CONTACT_FORM',
	`status` enum('NEW','CONTACTED','IN_PROGRESS','CONVERTED','CLOSED','SPAM') NOT NULL DEFAULT 'NEW',
	`priority` enum('LOW','NORMAL','HIGH') NOT NULL DEFAULT 'NORMAL',
	`assigned_to` int,
	`follow_up_date` date,
	`ip_hash` varchar(128),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiry_activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiry_id` int NOT NULL,
	`admin_id` int,
	`action` varchar(100) NOT NULL,
	`from_value` text,
	`to_value` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiry_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiry_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inquiry_id` int NOT NULL,
	`admin_id` int NOT NULL,
	`note` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiry_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `key_dates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` enum('GST','ITR','TAX') NOT NULL DEFAULT 'GST',
	`due_date` varchar(50) NOT NULL,
	`note` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `key_dates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(100),
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`short_description` text NOT NULL,
	`long_description` text NOT NULL,
	`icon` varchar(100) NOT NULL DEFAULT 'ShieldCheck',
	`badge` varchar(100),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`description` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`service_used` varchar(255),
	`rating` int NOT NULL DEFAULT 5,
	`message` text NOT NULL,
	`status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
	`source` enum('ADMIN','PUBLIC_FORM') NOT NULL DEFAULT 'ADMIN',
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_assigned_to_admin_users_id_fk` FOREIGN KEY (`assigned_to`) REFERENCES `admin_users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiry_activity` ADD CONSTRAINT `inquiry_activity_inquiry_id_inquiries_id_fk` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiry_activity` ADD CONSTRAINT `inquiry_activity_admin_id_admin_users_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admin_users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiry_notes` ADD CONSTRAINT `inquiry_notes_inquiry_id_inquiries_id_fk` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiry_notes` ADD CONSTRAINT `inquiry_notes_admin_id_admin_users_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admin_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_items` ADD CONSTRAINT `service_items_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_credentials_sort` ON `credentials` (`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_checklists_category` ON `document_checklists` (`category`);--> statement-breakpoint
CREATE INDEX `idx_checklists_sort` ON `document_checklists` (`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_faqs_category` ON `faqs` (`category`);--> statement-breakpoint
CREATE INDEX `idx_faqs_sort` ON `faqs` (`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_hero_slides_sort` ON `hero_slides` (`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_status_created` ON `inquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_phone` ON `inquiries` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_inquiry_activity_inquiry` ON `inquiry_activity` (`inquiry_id`);--> statement-breakpoint
CREATE INDEX `idx_inquiry_notes_inquiry` ON `inquiry_notes` (`inquiry_id`);--> statement-breakpoint
CREATE INDEX `idx_key_dates_category` ON `key_dates` (`category`);--> statement-breakpoint
CREATE INDEX `idx_key_dates_sort` ON `key_dates` (`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_service_items_service_id` ON `service_items` (`service_id`);--> statement-breakpoint
CREATE INDEX `idx_service_items_sort` ON `service_items` (`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_services_slug` ON `services` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_services_sort` ON `services` (`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_site_settings_key` ON `site_settings` (`key`);--> statement-breakpoint
CREATE INDEX `idx_testimonials_status` ON `testimonials` (`status`);--> statement-breakpoint
CREATE INDEX `idx_testimonials_sort` ON `testimonials` (`sort_order`);