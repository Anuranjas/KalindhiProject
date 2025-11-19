CREATE DATABASE IF NOT EXISTS `kalindhi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kalindhi`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(191) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Master list of tour packages
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `price` INT NOT NULL,
  `duration` VARCHAR(64) NOT NULL,
  `districts_json` JSON NULL,
  `features_json` JSON NULL,
  `highlight` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_packages_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed base tour packages
INSERT IGNORE INTO `packages` (`id`, `name`, `price`, `duration`, `highlight`, `districts_json`, `features_json`) VALUES
  ('backwaters', 'Backwaters Escape', 14999, '3 Days / 2 Nights', 1,
    JSON_ARRAY('Alappuzha','Kottayam'),
    JSON_ARRAY('Alleppey houseboat stay','Sunset cruise & canoe ride','Traditional Kerala meals','Airport transfers')
  ),
  ('hills', 'Hill Station Retreat', 21999, '4 Days / 3 Nights', 0,
    JSON_ARRAY('Idukki'),
    JSON_ARRAY('Munnar tea plantation tour','Eravikulam National Park visit','Campfire & local dinner','3-star resort stay')
  ),
  ('beach-culture', 'Beach & Culture', 18999, '4 Days / 3 Nights', 0,
    JSON_ARRAY('Thiruvananthapuram'),
    JSON_ARRAY('Kovalam beach day trip','Kathakali cultural evening','Ayurvedic spa session','City tour of Trivandrum')
  ),
  ('grand-kerala', 'Grand Kerala Circuit', 34999, '6 Days / 5 Nights', 0,
    JSON_ARRAY('Ernakulam','Idukki','Alappuzha'),
    JSON_ARRAY('Cochin • Munnar • Thekkady • Alleppey','Jeep safari & spice plantation','Deluxe houseboat + resort stays','Breakfast & transfers included')
  ),
  ('wayanad-wild', 'Wayanad Wildlife & Caves', 23999, '4 Days / 3 Nights', 0,
    JSON_ARRAY('Wayanad'),
    JSON_ARRAY('Edakkal caves exploration','Wayanad wildlife safari','Banasura Sagar dam visit','Comfort resort stay')
  ),
  ('ayurveda-wellness', 'Ayurveda Wellness Retreat', 27999, '5 Days / 4 Nights', 0,
    JSON_ARRAY('Thiruvananthapuram'),
    JSON_ARRAY('Daily authentic Ayurvedic therapies','Doctor consultation & diet plan','Yoga & meditation sessions','Beachside calm resort')
  ),
  ('north-kerala', 'North Kerala Explorer', 25999, '5 Days / 4 Nights', 0,
    JSON_ARRAY('Kasaragod','Kannur'),
    JSON_ARRAY('Bekal Fort & beach sunset','Kannur Theyyam experience (seasonal)','Muzhappilangad drive-in beach','Local seafood tasting')
  ),
  ('kochi-heritage', 'Kochi Heritage Weekend', 12999, '2 Days / 1 Night', 0,
    JSON_ARRAY('Ernakulam'),
    JSON_ARRAY('Fort Kochi walking tour','Chinese fishing nets & sunset','Synagogue & Dutch Palace visit','Boutique homestay')
  );


-- Table to store package booking requests
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `applicant_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `people_count` INT NOT NULL,
  `transport_mode` VARCHAR(50) NOT NULL,
  `package_id` VARCHAR(64) NOT NULL,
  `package_name` VARCHAR(191) NOT NULL,
  `package_date` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_bookings_email` (`email`),
  CHECK (`people_count` > 0),
  CONSTRAINT `fk_bookings_package` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

