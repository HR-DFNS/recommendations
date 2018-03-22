CREATE DATABASE IF NOT EXISTS wegot;

USE wegot;

CREATE TABLE IF NOT EXISTS recommendations (
  `name` VARCHAR(50),
  `place_id` INT,
  `google_rating` numeric(2,1),
  `zagat_food_rating` numeric(2,1),
  `review_count` INT,
  `photos` VARCHAR(320),
  `short_description` VARCHAR(110),
  `neighborhood` VARCHAR(20),
  `location` VARCHAR(25),
  `address` VARCHAR(75),
  `website` VARCHAR(30),
  `price_level` TINYINT,
  `types` VARCHAR(75),
  `nearby` VARCHAR(55),
  PRIMARY KEY (`place_id`)
);

-- LOAD DATA LOCAL INFILE "create_fake_seed_data.csv" INTO TABLE recommendations COLUMNS TERMINATED BY '^' LINES TERMINATED BY '\n';

-- mysql -u root --local-infile wegot