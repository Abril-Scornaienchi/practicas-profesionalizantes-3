/*---Creacion base de datos---*/
CREATE DATABASE IF NOT EXISTS `actividad-1`; 
    DEFAULT CHARACTER SET utf8
    COLLATE utf8_bin;

USE `actividad-2`; 
/*---Crear Tabla---*/
CREATE TABLE country(  
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    capital_city VARCHAR(50) NOT NULL UNIQUE,
    language VARCHAR(50) NOT NULL,
    surface INT NOT NULL,
    population BIGINT NOT NULL
) DEFAULT CHARACTER SET utf8
    COLLATE utf8_bin;

/*---Precarga de paises---*/
INSERT INTO country(name, capital_city, language, surface, population) VALUES
    ('Argentina','Buenos Aires','Español',278400,46200000),
    ('Brasil','Brasília','Portugés',8515767,203000000),
    ('Canadá','Ottawa','Ingles,Frances',9984670,39000000),
    ('Alemania','Berlín','Alemán',357022,83000000),
    ('Japón','Tokio','Japonés',377975,125000000);

/*---Obtener datos de un país---*/
DELIMITER//

CREATE PROCEDURE country_obtain_by_name(
    IN p_name VARCHAR(50)
)
BEGIN 
    SELECT * FROM country
    WHERE name = p_name;
END //

DELIMITER ;

CALL country_obtain_by_name('Brasil');

/*---Crear un país---*/
DELIMITER//

CREATE PROCEDURE country_insert(
    IN p_name VARCHAR(50),
    IN p_capital_city VARCHAR(50),
    IN p_language VARCHAR(50),
    IN p_surface INT,
    IN p_population BIGINT
)
BEGIN
    INSERT INTO country(name, capital_city, language, surface, population)
    VALUES (p_name, p_capital_city, p_language, p_surface, p_population);
END //

DELIMITER ;

CALL country_insert('Chile', 'Santiago de Chile', 'Español', 756102, 19400000);

/*--Editar un país---*/
DELIMITER //
CREATE PROCEDURE country_update(
    IN p_id INT,
    IN p_name VARCHAR(50),
    IN p_capital_city VARCHAR(50),
    IN p_language VARCHAR(50),
    IN p_surface INT,
    IN p_population BIGINT
)
BEGIN 
    UPDATE country
    SET name = p_name, 
    capital_city = p_capital_city, 
    language = p_language, 
    surface = p_surface, 
    population = p_population
    WHERE id = p_id;
END //

DELIMITER ;

CALL country_update(6,'Egipto','El Cairo','Árabe',1002000,110000000);

/*---Eliminar un país---*/
DELIMITER //

CREATE PROCEDURE country_delete (
    IN p_id INT
)
BEGIN   
    DELETE FROM country
    WHERE id = p_id;
END //

DELIMITER ;

CALL country_delete(3);