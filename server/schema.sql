-- Kalindhi Project - Database Initialization Script
-- Usage: Copy and paste this into your MySQL terminal or client to set up the database.

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `kalindhi`;
USE `kalindhi`;

-- Set proper character set
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------
-- Table: admins
-- ------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_approved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed: Main Admin
INSERT INTO `admins` (`name`, `email`, `password_hash`, `is_approved`) 
VALUES ('Main Admin', 'kalinditouristpackages@gmail.com', '$2a$10$padFeICpFWRLHKiOMf/dO.0zddsU6hsvGapApGuJDWoei6EUkQhNO', 1)
ON DUPLICATE KEY UPDATE is_approved = 1;

-- ------------------------------------------------------
-- Table: users (Travelers)
-- ------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Table: user_otps (Temporary codes for login/verification)
-- ------------------------------------------------------
DROP TABLE IF EXISTS `user_otps`;
CREATE TABLE `user_otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Table: enquiries (Contact messages)
-- ------------------------------------------------------
DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  `is_archived` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Table: packages (Travel experiences inventory)
-- ------------------------------------------------------
DROP TABLE IF EXISTS `packages`;
CREATE TABLE `packages` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `duration` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `districts_json` json DEFAULT NULL,
  `features_json` json DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `highlight` tinyint(1) NOT NULL DEFAULT '0',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=300',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_packages_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Table: bookings (Traveler reservations)
-- ------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `people_count` int NOT NULL,
  `transport_mode` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  PRIMARY KEY (`id`),
  KEY `idx_bookings_email` (`email`),
  KEY `fk_bookings_package` (`package_id`),
  CONSTRAINT `fk_bookings_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_chk_1` CHECK ((`people_count` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
