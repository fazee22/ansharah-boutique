-- =====================================================================
-- Phase 1 schema snapshot — generated reference only.
-- Authoritative source: backend/database/migrations/
-- Regenerate after each phase with:
--   php artisan schema:dump  (or your DB client's "export schema" tool)
-- =====================================================================

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer','admin','super_admin') NOT NULL DEFAULT 'customer',
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- password_reset_tokens, sessions, cache, cache_locks, jobs,
-- job_batches, and failed_jobs are Laravel framework tables — see
-- backend/database/migrations/0001_01_01_000001_create_cache_table.php
-- and 0001_01_01_000002_create_jobs_table.php for their exact DDL.
