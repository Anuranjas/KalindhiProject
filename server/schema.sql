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
-- Password is 'admin123' hashed with bcrypt
INSERT INTO `admins` (`name`, `email`, `password_hash`, `is_approved`) 
VALUES ('Main Admin', 'kalinditouristpackages@gmail.com', '$2a$10$C/DkELhduhEMYm95zfFqrO7Yb1JUyJaP5lR5AjxG9aaPkgUiBAqOe', 1)
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
INSERT INTO places (`name`, `district`, `description`, `price_per_person`) VALUES 
('Sree Padmanabhaswamy Temple', 'Thiruvananthapuram', 'Explore the beauty of Sree Padmanabhaswamy Temple', 200),
('Kovalam Beach', 'Thiruvananthapuram', 'Explore the beauty of Kovalam Beach', 200),
('Varkala Cliff & Beach', 'Thiruvananthapuram', 'Explore the beauty of Varkala Cliff & Beach', 200),
('Ponmudi', 'Thiruvananthapuram', 'Explore the beauty of Ponmudi', 200),
('Napier Museum', 'Thiruvananthapuram', 'Explore the beauty of Napier Museum', 200),
('Kuthiramalika Palace', 'Thiruvananthapuram', 'Explore the beauty of Kuthiramalika Palace', 200),
('Shangumugham Beach', 'Thiruvananthapuram', 'Explore the beauty of Shangumugham Beach', 200),
('Poovar Island', 'Thiruvananthapuram', 'Explore the beauty of Poovar Island', 200),
('Neyyar Dam', 'Thiruvananthapuram', 'Explore the beauty of Neyyar Dam', 200),
('Agasthyakoodam', 'Thiruvananthapuram', 'Explore the beauty of Agasthyakoodam', 200),
('Ashtamudi Lake', 'Kollam', 'Explore the beauty of Ashtamudi Lake', 200),
('Jatayu Earth Center', 'Kollam', 'Explore the beauty of Jatayu Earth Center', 200),
('Palaruvi Waterfalls', 'Kollam', 'Explore the beauty of Palaruvi Waterfalls', 200),
('Thangassery Lighthouse', 'Kollam', 'Explore the beauty of Thangassery Lighthouse', 200),
('Kollam Beach', 'Kollam', 'Explore the beauty of Kollam Beach', 200),
('Thenmala Ecotourism', 'Kollam', 'Explore the beauty of Thenmala Ecotourism', 200),
('Sasthamkotta Lake', 'Kollam', 'Explore the beauty of Sasthamkotta Lake', 200),
('Mayyanad Beach', 'Kollam', 'Explore the beauty of Mayyanad Beach', 200),
('Oachira Temple', 'Kollam', 'Explore the beauty of Oachira Temple', 200),
('Munroe Island', 'Kollam', 'Explore the beauty of Munroe Island', 200),
('Sabarimala Temple', 'Pathanamthitta', 'Explore the beauty of Sabarimala Temple', 200),
('Gavi', 'Pathanamthitta', 'Explore the beauty of Gavi', 200),
('Aranmula Temple', 'Pathanamthitta', 'Explore the beauty of Aranmula Temple', 200),
('Perunthenaruvi Waterfalls', 'Pathanamthitta', 'Explore the beauty of Perunthenaruvi Waterfalls', 200),
('Konni Elephant Camp', 'Pathanamthitta', 'Explore the beauty of Konni Elephant Camp', 200),
('Parumala Church', 'Pathanamthitta', 'Explore the beauty of Parumala Church', 200),
('Achankovil', 'Pathanamthitta', 'Explore the beauty of Achankovil', 200),
('Kakki Reservoir', 'Pathanamthitta', 'Explore the beauty of Kakki Reservoir', 200),
('Pandalam Palace', 'Pathanamthitta', 'Explore the beauty of Pandalam Palace', 200),
('Malayalapuzha Temple', 'Pathanamthitta', 'Explore the beauty of Malayalapuzha Temple', 200),
('Alappuzha Backwaters', 'Alappuzha', 'Explore the beauty of Alappuzha Backwaters', 200),
('Alappuzha Beach', 'Alappuzha', 'Explore the beauty of Alappuzha Beach', 200),
('Marari Beach', 'Alappuzha', 'Explore the beauty of Marari Beach', 200),
('Kuttanad', 'Alappuzha', 'Explore the beauty of Kuttanad', 200),
('Pathiramanal Island', 'Alappuzha', 'Explore the beauty of Pathiramanal Island', 200),
('Krishnapuram Palace', 'Alappuzha', 'Explore the beauty of Krishnapuram Palace', 200),
('Ambalappuzha Temple', 'Alappuzha', 'Explore the beauty of Ambalappuzha Temple', 200),
('Kumarakom Bird Sanctuary (border area)', 'Alappuzha', 'Explore the beauty of Kumarakom Bird Sanctuary (border area)', 200),
('Arthunkal Church', 'Alappuzha', 'Explore the beauty of Arthunkal Church', 200),
('Mannarasala Temple', 'Alappuzha', 'Explore the beauty of Mannarasala Temple', 200),
('Kumarakom', 'Kottayam', 'Explore the beauty of Kumarakom', 200),
('Illikkal Kallu', 'Kottayam', 'Explore the beauty of Illikkal Kallu', 200),
('Vagamon', 'Kottayam', 'Explore the beauty of Vagamon', 200),
('Marmala Waterfalls', 'Kottayam', 'Explore the beauty of Marmala Waterfalls', 200),
('Vaikom Temple', 'Kottayam', 'Explore the beauty of Vaikom Temple', 200),
('Ettumanoor Temple', 'Kottayam', 'Explore the beauty of Ettumanoor Temple', 200),
('Poonjar Palace', 'Kottayam', 'Explore the beauty of Poonjar Palace', 200),
('Thangalpara', 'Kottayam', 'Explore the beauty of Thangalpara', 200),
('Nadukani', 'Kottayam', 'Explore the beauty of Nadukani', 200),
('Aruvikkuzhi Waterfalls', 'Kottayam', 'Explore the beauty of Aruvikkuzhi Waterfalls', 200),
('Munnar', 'Idukki', 'Explore the beauty of Munnar', 200),
('Thekkady', 'Idukki', 'Explore the beauty of Thekkady', 200),
('Periyar Wildlife Sanctuary', 'Idukki', 'Explore the beauty of Periyar Wildlife Sanctuary', 200),
('Idukki Dam', 'Idukki', 'Explore the beauty of Idukki Dam', 200),
('Ramakkalmedu', 'Idukki', 'Explore the beauty of Ramakkalmedu', 200),
('Kolukkumalai', 'Idukki', 'Explore the beauty of Kolukkumalai', 200),
('Anamudi Peak', 'Idukki', 'Explore the beauty of Anamudi Peak', 200),
('Mattupetty Dam', 'Idukki', 'Explore the beauty of Mattupetty Dam', 200),
('Eravikulam National Park', 'Idukki', 'Explore the beauty of Eravikulam National Park', 200),
('Vagamon (border area)', 'Idukki', 'Explore the beauty of Vagamon (border area)', 200),
('Fort Kochi', 'Ernakulam', 'Explore the beauty of Fort Kochi', 200),
('Mattancherry Palace', 'Ernakulam', 'Explore the beauty of Mattancherry Palace', 200),
('Marine Drive', 'Ernakulam', 'Explore the beauty of Marine Drive', 200),
('Lulu Mall', 'Ernakulam', 'Explore the beauty of Lulu Mall', 200),
('Cherai Beach', 'Ernakulam', 'Explore the beauty of Cherai Beach', 200),
('Hill Palace Museum', 'Ernakulam', 'Explore the beauty of Hill Palace Museum', 200),
('Wonderla', 'Ernakulam', 'Explore the beauty of Wonderla', 200),
('Bolgatty Palace', 'Ernakulam', 'Explore the beauty of Bolgatty Palace', 200),
('Thattekad Bird Sanctuary', 'Ernakulam', 'Explore the beauty of Thattekad Bird Sanctuary', 200),
('Jewish Synagogue', 'Ernakulam', 'Explore the beauty of Jewish Synagogue', 200),
('Guruvayur Temple', 'Thrissur', 'Explore the beauty of Guruvayur Temple', 200),
('Athirappilly Waterfalls', 'Thrissur', 'Explore the beauty of Athirappilly Waterfalls', 200),
('Vadakkunnathan Temple', 'Thrissur', 'Explore the beauty of Vadakkunnathan Temple', 200),
('Thrissur Zoo', 'Thrissur', 'Explore the beauty of Thrissur Zoo', 200),
('Chavakkad Beach', 'Thrissur', 'Explore the beauty of Chavakkad Beach', 200),
('Kodungallur Temple', 'Thrissur', 'Explore the beauty of Kodungallur Temple', 200),
('Snehatheeram Beach', 'Thrissur', 'Explore the beauty of Snehatheeram Beach', 200),
('Peechi Dam', 'Thrissur', 'Explore the beauty of Peechi Dam', 200),
('Kerala Kalamandalam', 'Thrissur', 'Explore the beauty of Kerala Kalamandalam', 200),
('Vazhachal Waterfalls', 'Thrissur', 'Explore the beauty of Vazhachal Waterfalls', 200),
('Palakkad Fort', 'Palakkad', 'Explore the beauty of Palakkad Fort', 200),
('Silent Valley', 'Palakkad', 'Explore the beauty of Silent Valley', 200),
('Malampuzha Dam', 'Palakkad', 'Explore the beauty of Malampuzha Dam', 200),
('Parambikulam Tiger Reserve', 'Palakkad', 'Explore the beauty of Parambikulam Tiger Reserve', 200),
('Nelliyampathy', 'Palakkad', 'Explore the beauty of Nelliyampathy', 200),
('Dhoni Waterfalls', 'Palakkad', 'Explore the beauty of Dhoni Waterfalls', 200),
('Attappady', 'Palakkad', 'Explore the beauty of Attappady', 200),
('Kava Island', 'Palakkad', 'Explore the beauty of Kava Island', 200),
('Meenvallam Waterfalls', 'Palakkad', 'Explore the beauty of Meenvallam Waterfalls', 200),
('Kalpathy Temple', 'Palakkad', 'Explore the beauty of Kalpathy Temple', 200),
('Kottakkunnu', 'Malappuram', 'Explore the beauty of Kottakkunnu', 200),
('Nilambur Teak Museum', 'Malappuram', 'Explore the beauty of Nilambur Teak Museum', 200),
('Adyanpara Waterfalls', 'Malappuram', 'Explore the beauty of Adyanpara Waterfalls', 200),
('Biyyam Kayal', 'Malappuram', 'Explore the beauty of Biyyam Kayal', 200),
('Kodikuthimala', 'Malappuram', 'Explore the beauty of Kodikuthimala', 200),
('Kadalundi Bird Sanctuary', 'Malappuram', 'Explore the beauty of Kadalundi Bird Sanctuary', 200),
('Tanur Beach', 'Malappuram', 'Explore the beauty of Tanur Beach', 200),
('Thirunavaya Temple', 'Malappuram', 'Explore the beauty of Thirunavaya Temple', 200),
('Arimbra Hills', 'Malappuram', 'Explore the beauty of Arimbra Hills', 200),
('Mini Ooty', 'Malappuram', 'Explore the beauty of Mini Ooty', 200),
('Kozhikode Beach', 'Kozhikode', 'Explore the beauty of Kozhikode Beach', 200),
('Kappad Beach', 'Kozhikode', 'Explore the beauty of Kappad Beach', 200),
('Beypore Port', 'Kozhikode', 'Explore the beauty of Beypore Port', 200),
('Thusharagiri Waterfalls', 'Kozhikode', 'Explore the beauty of Thusharagiri Waterfalls', 200),
('Mananchira Square', 'Kozhikode', 'Explore the beauty of Mananchira Square', 200),
('Sarovaram Park', 'Kozhikode', 'Explore the beauty of Sarovaram Park', 200),
('Planetarium', 'Kozhikode', 'Explore the beauty of Planetarium', 200),
('Vellari Mala', 'Kozhikode', 'Explore the beauty of Vellari Mala', 200),
('Peruvannamuzhi Dam', 'Kozhikode', 'Explore the beauty of Peruvannamuzhi Dam', 200),
('SM Street', 'Kozhikode', 'Explore the beauty of SM Street', 200),
('Edakkal Caves', 'Wayanad', 'Explore the beauty of Edakkal Caves', 200),
('Banasura Sagar Dam', 'Wayanad', 'Explore the beauty of Banasura Sagar Dam', 200),
('Chembra Peak', 'Wayanad', 'Explore the beauty of Chembra Peak', 200),
('Soochipara Waterfalls', 'Wayanad', 'Explore the beauty of Soochipara Waterfalls', 200),
('Pookode Lake', 'Wayanad', 'Explore the beauty of Pookode Lake', 200),
('Wayanad Wildlife Sanctuary', 'Wayanad', 'Explore the beauty of Wayanad Wildlife Sanctuary', 200),
('Kuruvadweep', 'Wayanad', 'Explore the beauty of Kuruvadweep', 200),
('Thirunelli Temple', 'Wayanad', 'Explore the beauty of Thirunelli Temple', 200),
('Meenmutty Waterfalls', 'Wayanad', 'Explore the beauty of Meenmutty Waterfalls', 200),
('Lakkidi View Point', 'Wayanad', 'Explore the beauty of Lakkidi View Point', 200),
('Muzhappilangad Drive-in Beach', 'Kannur', 'Explore the beauty of Muzhappilangad Drive-in Beach', 200),
('St. Angelo Fort', 'Kannur', 'Explore the beauty of St. Angelo Fort', 200),
('Payyambalam Beach', 'Kannur', 'Explore the beauty of Payyambalam Beach', 200),
('Aralam Wildlife Sanctuary', 'Kannur', 'Explore the beauty of Aralam Wildlife Sanctuary', 200),
('Parassinikadavu Temple', 'Kannur', 'Explore the beauty of Parassinikadavu Temple', 200),
('Palakkayam Thattu', 'Kannur', 'Explore the beauty of Palakkayam Thattu', 200),
('Meenkunnu Beach', 'Kannur', 'Explore the beauty of Meenkunnu Beach', 200),
('Madayi Para', 'Kannur', 'Explore the beauty of Madayi Para', 200),
('Dharmadam Island', 'Kannur', 'Explore the beauty of Dharmadam Island', 200),
('Theyyam (cultural attraction)', 'Kannur', 'Explore the beauty of Theyyam (cultural attraction)', 200),
('Bekal Fort', 'Kasaragod', 'Explore the beauty of Bekal Fort', 200),
('Ranipuram', 'Kasaragod', 'Explore the beauty of Ranipuram', 200),
('Ananthapura Lake Temple', 'Kasaragod', 'Explore the beauty of Ananthapura Lake Temple', 200),
('Kappil Beach', 'Kasaragod', 'Explore the beauty of Kappil Beach', 200),
('Chandragiri Fort', 'Kasaragod', 'Explore the beauty of Chandragiri Fort', 200),
('Valiyaparamba Backwaters', 'Kasaragod', 'Explore the beauty of Valiyaparamba Backwaters', 200),
('Mallikarjuna Temple', 'Kasaragod', 'Explore the beauty of Mallikarjuna Temple', 200),
('Bekal Beach', 'Kasaragod', 'Explore the beauty of Bekal Beach', 200),
('Posadi Gumpe', 'Kasaragod', 'Explore the beauty of Posadi Gumpe', 200),
('Nileshwaram', 'Kasaragod', 'Explore the beauty of Nileshwaram', 200);

-- ------------------------------------------------------
-- Table: package_purchased_routes (Directions linked to packages)
-- ------------------------------------------------------
DROP TABLE IF EXISTS `package_purchased_routes`;
CREATE TABLE `package_purchased_routes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `package_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_lat` decimal(10,8) NOT NULL,
  `destination_lng` decimal(11,8) NOT NULL,
  `purchased_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_package_id` (`package_id`),
  CONSTRAINT `fk_pkg_routes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pkg_routes_pkg` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
