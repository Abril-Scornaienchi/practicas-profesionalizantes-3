CREATE DATABASE IF NOT EXISTS `actividad-2`;
USE `actividad-2`;

DROP TABLE IF EXISTS `city`;
DROP TABLE IF EXISTS `country`;

-- Crea tabla 'country'
CREATE TABLE `country` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `capital_city` VARCHAR(100) NOT NULL,
  `language` VARCHAR(100) NOT NULL,
  `surface` DECIMAL(15,2) NOT NULL,
  `population` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Creación de la tabla 'city' 
CREATE TABLE `city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `population` BIGINT NOT NULL,
  `surface` DECIMAL(15,2) NOT NULL,
  `postal_code` VARCHAR(10) NOT NULL,
  `is_coastal` BOOLEAN NOT NULL,
  `id_country` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_city_country_idx` (`id_country`),
  CONSTRAINT `fk_city_country` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Datos para la tabla 'country'
LOCK TABLES `country` WRITE;
INSERT IGNORE INTO `country` (`id`, `name`, `capital_city`, `language`, `surface`, `population`) VALUES
(1,'Argentina','Buenos Aires','Spanish',2780400.00,47800000),
(2,'Italy','Rome','Italian',302073.00,59000000),
(3,'England','London','English',130279.00,56489000),
(4,'Spain','Madrid','Spanish',505990.00,47600000),
(5,'United States of America','Washington D.C.','English',9831510.00,331000000);
UNLOCK TABLES;

-- Datos para la tabla 'city'
INSERT IGNORE INTO `city` (`id`, `name`, `population`, `surface`, `postal_code`, `is_coastal`, `id_country`) VALUES
(1,'Miami',470000,143.10,'33101',1,(SELECT id FROM country WHERE name='United States of America')),
(2,'Orlando',300000,262.20,'32801',0,(SELECT id FROM country WHERE name='United States of America')), -- Agregado Orlando con ID 2
(3,'Barcelona',5580000,101.90,'08001',1,(SELECT id FROM country WHERE name='Spain')),
(4,'London',9000000,1572.00,'SW1A',0,(SELECT id FROM country WHERE name='England')),
(5,'Buenos Aires',15500000,203.00,'C1000',0,(SELECT id FROM country WHERE name='Argentina')),
(6,'Rome',2870000,1285.00,'00118',0,(SELECT id FROM country WHERE name='Italy')),
(7,'Mar del Plata',650000,100.00,'B7600',1,(SELECT id FROM country WHERE name='Argentina')),
(8,'Valencia',800000,134.60,'46001',1,(SELECT id FROM country WHERE name='Spain'));
UNLOCK TABLES;


DELIMITER ;;

-- Procedimiento: city_create
DROP PROCEDURE IF EXISTS `city_create`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `city_create`(
    IN p_name VARCHAR(100),
    IN p_population BIGINT,
    IN p_surface DECIMAL(15,2),
    IN p_postal_code VARCHAR(10),
    IN p_is_coastal BOOLEAN,
    IN p_id_country INT

BEGIN
    IF NOT EXISTS (SELECT 1 FROM city WHERE name = p_name) THEN
        INSERT INTO city (name, population, surface, postal_code, is_coastal, id_country)
        VALUES (p_name, p_population, p_surface, p_postal_code, p_is_coastal, p_id_country);
    ELSE
        SELECT CONCAT('Advertencia: La ciudad ', p_name, ' ya existe y no fue insertada nuevamente.') AS Message;
    END IF;
END ;;

-- Procedimiento: city_delete
DROP PROCEDURE IF EXISTS `city_delete`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `city_delete`(
    IN p_id INT
)
BEGIN
    DELETE FROM city
    WHERE id = p_id;
END ;;

-- Procedimiento: city_read
DROP PROCEDURE IF EXISTS `city_read`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `city_read`(
    IN p_name VARCHAR(100),
    IN p_id_city INT,
    IN p_id_country INT
)
BEGIN
    SELECT
        c.id,
        c.name,
        c.population,
        c.surface,
        c.postal_code,
        c.is_coastal,
        c.id_country,
        p.name AS country_name
    FROM
        city c
    JOIN
        country p ON c.id_country = p.id
    WHERE
        (p_name IS NULL OR c.name = p_name) AND
        (p_id_city IS NULL OR c.id = p_id_city) AND
        (p_id_country IS NULL OR c.id_country = p_id_country);
END ;;

-- Procedimiento: city_update
DROP PROCEDURE IF EXISTS `city_update`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `city_update`(
    IN p_id INT,
    IN p_name VARCHAR(100),
    IN p_population BIGINT,
    IN p_surface DECIMAL(15,2),
    IN p_postal_code VARCHAR(10),
    IN p_is_coastal BOOLEAN,
    IN p_id_country INT
)
BEGIN
    UPDATE city
    SET
        name = p_name,
        population = p_population,
        surface = p_surface,
        postal_code = p_postal_code,
        is_coastal = p_is_coastal,
        id_country = p_id_country
    WHERE id = p_id;
END ;;

-- Procedimiento: countries_with_coastal_cities_over_1M
DROP PROCEDURE IF EXISTS `countries_with_coastal_cities_over_1M`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `countries_with_coastal_cities_over_1M`()
BEGIN
    SELECT DISTINCT p.name AS country_name
    FROM country p
    JOIN city c ON p.id = c.id_country
    WHERE c.is_coastal = TRUE
      AND c.population > 1000000;
END ;;

-- Procedimiento: country_city_highest_density
DROP PROCEDURE IF EXISTS `country_city_highest_density`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `country_city_highest_density`()
BEGIN
    SELECT p.name AS country_name,
           c.name AS city_name,
           (c.population / c.surface) AS population_density
    FROM city c
    JOIN country p ON c.id_country = p.id
    WHERE c.surface > 0
    ORDER BY (c.population / c.surface) DESC
    LIMIT 1;
END ;;

-- Procedimiento: country_create
DROP PROCEDURE IF EXISTS `country_create`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `country_create`(
    IN p_name VARCHAR(100),
    IN p_capital_city VARCHAR(100),
    IN p_language VARCHAR(100),
    IN p_surface DECIMAL(15,2),
    IN p_population BIGINT
)
BEGIN
    INSERT INTO country (name, capital_city, language, surface, population)
    VALUES (p_name, p_capital_city, p_language, p_surface, p_population);
END ;;

-- Procedimiento: country_delete
DROP PROCEDURE IF EXISTS `country_delete`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `country_delete`(
    IN p_id INT
)
BEGIN
    DELETE FROM country
    WHERE id = p_id;
END ;;

-- Procedimiento: country_read
DROP PROCEDURE IF EXISTS `country_read`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `country_read`(
    IN p_name VARCHAR(100)
)
BEGIN
    IF p_name IS NULL THEN
        SELECT id, name, capital_city, language, surface, population
        FROM country;
    ELSE
        SELECT id, name, capital_city, language, surface, population
        FROM country
        WHERE name = p_name;
    END IF;
END ;;

-- Procedimiento: country_update
DROP PROCEDURE IF EXISTS `country_update`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `country_update`(
    IN p_id INT,
    IN p_name VARCHAR(100),
    IN p_capital_city VARCHAR(100),
    IN p_language VARCHAR(100),
    IN p_surface DECIMAL(15,2),
    IN p_population BIGINT
)
BEGIN
    UPDATE country
    SET
        name = p_name,
        capital_city = p_capital_city,
        language = p_language,
        surface = p_surface,
        population = p_population
    WHERE id = p_id;
END ;;

-- Procedimiento: country_with_most_populated_city
DROP PROCEDURE IF EXISTS `country_with_most_populated_city`;
CREATE DEFINER=`root`@`localhost` PROCEDURE `country_with_most_populated_city`()
BEGIN
    SELECT p.name AS country_name,
           c.name AS city_name,
           c.population
    FROM city c
    JOIN country p ON c.id_country = p.id
    ORDER BY c.population DESC
    LIMIT 1;
END ;;

DELIMITER ;