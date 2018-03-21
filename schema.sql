CREATE DATABASE IF NOT EXISTS wegot;

USE wegot;

CREATE TABLE IF NOT EXISTS recommendations (
  `name` VARCHAR(100),
  `place_id` INT,
  `google_rating` numeric(2,1),
  `zagat_food_rating` numeric(2,1),
  `review_count` INT,
  `photos` VARCHAR(350),
  `short_description` VARCHAR(100),
  `neighborhood` VARCHAR(100),
  `location` VARCHAR(100),
  `address` VARCHAR(100),
  `website` VARCHAR(100),
  `price_level` TINYINT,
  `types` VARCHAR(100),
  `nearby` VARCHAR(100),
  PRIMARY KEY (`place_id`)
);

-- LOAD DATA LOCAL INFILE "create_fake_seed_data.csv" INTO TABLE recommendations COLUMNS TERMINATED BY '^' LINES TERMINATED BY '\n';

-- mysql -u root --local-infile wegot