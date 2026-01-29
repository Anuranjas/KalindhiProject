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
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

-- Seed: Core Packages
INSERT INTO `packages` (`id`, `name`, `price`, `duration`, `highlight`, `districts_json`, `features_json`, `description`) VALUES 
('wayanad-mist', 'Wayanad Mist', 15999, '3 Days / 2 Nights', 1, '["Wayanad"]', '["Luxury resort stay", "Edakkal Caves visit", "Banasura Sagar Dam", "Tea plantation walk"]', 'Experience the misty hills and lush greenery of Wayanad.'),
('munnar-tea', 'Munnar Tea Trails', 12999, '3 Days / 2 Nights', 0, '["Idukki"]', '["Tea museum visit", "Eravikulam National Park", "Mattupetty Dam", "Echo Point"]', 'Explore the rolling hills and tea gardens of Munnar.'),
('wayanad', 'Wayanad Wilderness', 18999, '3 Days / 2 Nights', 0, '["Wayanad"]', '["Luxury forest cabin stay", "Meenmutty falls trek", "Tribal village encounter", "Wildlife safari"]', 'Deep dive into the ancient forests of Wayanad.'),
('coastal', 'Coastal Breeze', 12499, '2 Days / 1 Night', 0, '["Kannur", "Kozhikode"]', '["Drive-in beach experience", "Theyyam ritual viewing", "Malabar cuisine tasting", "Handloom weaving unit"]', 'Explore the northern shores of Kerala.'),
('spiritual', 'Path of Peace', 15999, '5 Days / 4 Nights', 0, '["Kottayam", "Pathanamthitta"]', '["Sabarimala base visit", "Traditional ashram stay", "Vedic yoga sessions", "Pure vegetarian soul food"]', 'A journey of inner discovery.'),
('heritage', 'Capital Heritage', 9999, '2 Days / 1 Night', 1, '["Thiruvananthapuram"]', '["Padmanabhaswamy temple visit", "Kovalam beach sunset", "Museum & Gallery tour", "Royal heritage stay"]', 'The grandeur of the royal capital.'),
('custom', 'Custom Package', 0, 'Custom', 0, '[]', '["Pick your own locations", "Flexible duration", "Private transportation", "Custom meal plans"]', 'Create your own dream itinerary across Kerala.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

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
  `total_price` int DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `selected_places_json` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bookings_email` (`email`),
  KEY `fk_bookings_package` (`package_id`),
  CONSTRAINT `fk_bookings_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_chk_1` CHECK ((`people_count` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Table: places (For Custom Packages)
-- ------------------------------------------------------
DROP TABLE IF EXISTS `places`;
CREATE TABLE `places` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `district` VARCHAR(100),
  `description` TEXT,
  `image` VARCHAR(255),
  `price_per_person` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed: Sample Places for Custom Packages
INSERT INTO `places` (`name`, `district`, `description`, `price_per_person`) VALUES 
('Munnar Tea Gardens', 'Idukki', 'Lush green tea estates and scenic hills', 500),
('Varkala Cliff', 'Thiruvananthapuram', 'Stunning cliff views and pristine beaches', 300),
('Fort Kochi', 'Ernakulam', 'Historic colonial architecture and chinese fishing nets', 200),
('Muzhappilangad Drive-in Beach', 'Kannur', 'Asias longest drive-in beach', 150),
('Wayanad Wildlife Sanctuary', 'Wayanad', 'Breathtaking forests and wild life encounters', 400);

SET FOREIGN_KEY_CHECKS = 1;
