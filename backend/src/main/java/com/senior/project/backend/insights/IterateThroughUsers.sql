-- a stored process to retrieve data for analysis

DELIMITER //

CREATE PROCEDURE IterateThroughUsers()
BEGIN
    DECLARE done INT DEFAULT 0;
    
    DECLARE user_id_hex VARCHAR(64);
    DECLARE user_student_details_id_hex VARCHAR(64);
    DECLARE user_name VARCHAR(255);
    DECLARE user_role VARCHAR(50);
    DECLARE user_year VARCHAR(255);
    DECLARE user_major VARCHAR(255);
    DECLARE user_resume INT;
    DECLARE user_internship INT;
    DECLARE user_internship_this_year INT;
    DECLARE user_internship_last_year INT;
    DECLARE user_date DATE;
    
    DECLARE user_cursor CURSOR FOR SELECT HEX(id), HEX(student_details_id), email, role FROM user;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN user_cursor;

    read_loop: LOOP
        -- Reset variables for each iteration
        SET user_id_hex = '', 
            user_student_details_id_hex = '', 
            user_name = '', 
            user_role = '', 
            user_year = '', 
            user_major = '', 
            user_resume = 0, 
            user_internship = 0, 
            user_internship_this_year = 0,
            user_internship_last_year = 0,
            user_date = CURDATE();

        FETCH user_cursor INTO user_id_hex, user_student_details_id_hex, user_name, user_role;
        
        -- Check if the cursor has reached the end
        IF done = 1 THEN 
            LEAVE read_loop;
        END IF;
        
        -- Skip the iteration if the role is not "Student"
		IF user_role != 'Student' THEN
            ITERATE read_loop;
        END IF;

        -- get year
        SELECT year_level INTO user_year FROM student_details WHERE HEX(id) = user_student_details_id_hex;

        -- get major
        SELECT name INTO user_major FROM degree_program WHERE HEX(student_details_id) = user_student_details_id_hex AND is_minor = 0;
        
        -- get resume
        IF EXISTS (SELECT 1 FROM submission WHERE task_id = 6 AND HEX(student_id) = user_id_hex) THEN
            SET user_resume = 1;
        END IF;
        
        -- get internship
        IF EXISTS (SELECT 1 FROM job WHERE is_coop = 1 AND HEX(student_details_id) = user_student_details_id_hex) THEN
			SET user_internship = 1;
        END IF;

        SET user_date = CURDATE();

        -- get internship only if start_date is after March 31st of the current year
        -- might have to revaluate this one
        IF EXISTS (SELECT 1 FROM job WHERE is_coop = 1 AND HEX(student_details_id) = user_student_details_id_hex AND start_date > CONCAT(YEAR(user_date), '-04-30')) THEN
            SET user_internship_this_year = 1;
        END IF;


        -- get internship last year
        IF EXISTS (SELECT 1 FROM job WHERE is_coop = 1 AND HEX(student_details_id) = user_student_details_id_hex AND start_date > CONCAT(YEAR(user_date) - 1, '-04-30') AND start_date < CONCAT(YEAR(user_date), '-05-01')) THEN
            SET user_internship_last_year = 1;
        END IF;
        
        
        SELECT user_major, user_year, user_resume, user_internship, user_internship_this_year, user_internship_last_year; 
    END LOOP;

    CLOSE user_cursor;
END //

DELIMITER ;