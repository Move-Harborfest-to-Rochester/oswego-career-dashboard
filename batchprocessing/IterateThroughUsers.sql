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
    DECLARE user_resume INT;
    DECLARE user_skill INT;
    DECLARE user_internship INT;
    
    DECLARE user_cursor CURSOR FOR SELECT HEX(id), HEX(student_details_id), email, role FROM user;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN user_cursor;

    read_loop: LOOP
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
        
        -- get resume
		SET user_resume = 0;
        IF EXISTS (SELECT 1 FROM submission WHERE task_id = 6 AND HEX(student_id) = user_id_hex) THEN
            SET user_resume = 1;
        END IF;
        
        -- get internship
        SET user_internship = 0;
        IF EXISTS (SELECT 1 FROM job WHERE is_coop = 1 AND HEX(student_details_id) = user_student_details_id_hex) THEN
			SET user_internship = 1;
        END IF;
        
        -- get skills
        SET user_skill = 0;
        SELECT COUNT(*) INTO user_skill FROM skill WHERE HEX(student_details_id) = user_student_details_id_hex;
        IF user_skill >= 5 THEN
			SET user_skill = 1;
		ELSE
			SET user_skill = 0;
		END IF;
        
        SELECT user_year, user_resume, user_internship, user_skill; 
    END LOOP;

    CLOSE user_cursor;
END //

DELIMITER ;