 -- testable data
 
 -- person 1, freshman, yes resume, yes internship, yes 5 skills
 INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5653434'), 
    'freshman1@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'joe', 
    'joe', 
    'Freshman',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'),
	'00001',
	3.5,
	'Dynamic and motivated computer science freshman',
	'Freshman',
	'2028-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653436'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'Computer Science',
    0
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653437'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'History',
    1
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653438'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'Python',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653439'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'Java',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653440'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'Kotlin',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653441'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'html',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653442'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'css',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653443'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
	'English',
    1
);

INSERT INTO project (`id`, `student_details_id`, `name`, `description`, `start_date`, `end_date`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653444'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
    'fuzzer', 
    'built security testing application', 
    '2024-09-20', 
    '2024-10-16'
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653445'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
    'Wegmans: Cashier', 
    'Rochester, NY',
    'handled customer transactions',
    '2024-06-20', 
    '2024-9-01',
    0
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653446'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
    'BobCorp: Software Engineer Intern', 
    'Remote',
    'working on a full-stack application',
    '2024-9-05', 
    '2024-12-21',
    1
);

INSERT INTO club (`id`, `student_details_id`, `name`, `start_date`, `end_date`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653447'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
    'AI Club', 
    '2024-9-04',
    '2024-9-04'
);

INSERT INTO interest (`id`, `student_details_id`, `name`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653448'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653435'), 
    'AI'
);

INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    7,
	'headshot', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\headshot.png',
    UNHEX('70D5DFB877754F9EB87A1E8C5653434'),
    'PROFILE_PICTURE'
);
UPDATE `crd`.`user` SET `profile_picture_id` = '7' WHERE (`id` = 0x070D5DFB877754F9EB87A1E8C5653434);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    11,
    '',
    9, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653434'),
    6,
    '2024-10-23 00:52:57'
);
INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    9,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5653434'),
    'SUBMISSION'
);

 -- person 2, freshman, yes resume, no internship, no 5 skills
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5653660'), 
    'freshman2@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Jane', 
    'Jane', 
    'Freshman',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653461'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'),
	'00001',
	3.7,
	'Computer science freshman looking for an internship',
	'Freshman',
	'2028-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653661'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'),
	'Computer Science',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653662'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'),
	'Python',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653663'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'),
	'English',
    1
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653664'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'),
	'Spanish',
    1
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653665'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'),
    'Target: Cashier', 
    'New York, NY',
    'handled customer transactions',
    '2024-06-30', 
    '2024-8-22',
    0
);

INSERT INTO interest (`id`, `student_details_id`, `name`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653666'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'), 
    'Backend Development'
);

INSERT INTO interest (`id`, `student_details_id`, `name`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653667'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653461'), 
    'Music'
);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    12,
    '',
    10, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653660'),
    6,
    '2024-10-23 00:52:57'
);
INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    10,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5653660'), 
    'SUBMISSION'
);

 -- person 3, freshman, no resume, no internship, no 5 skills 
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5653770'), 
    'freshman3@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Josh', 
    'Josh', 
    'Freshman',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653000'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653000'), 
	'11115',
	3.7,
	'Stonks to da moon',
	'Freshman',
	'2028-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653771'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653000'), 
	'Business',
    0
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5653772'),
	UNHEX('70D5DFB877754F9EB87A1E8C5653000'), 
	'Communication',
    1
);

 -- person 4, Sophomore, yes resume, yes internship, yes 5 skills
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5654440'), 
    'Sophomore1@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Joe', 
    'Joe', 
    'Sophomore',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'45896',
	4.0,
	'Aspiring Writer',
	'Sophomore',
	'2027-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654442'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'English',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654443'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'Writing',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654444'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'Public Speaking',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654445'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'Power Point',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654446'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'Editing',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654447'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'Communication',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654448'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'English',
    1
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654449'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'), 
	'Spanish',
    1
);

INSERT INTO project (`id`, `student_details_id`, `name`, `description`, `start_date`, `end_date`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654450'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'),  
    'Revenge of Bob', 
    'Thriller Novel. In Revenge of Bob, a mild-mannered accountant snaps after a devastating betrayal, transforming into a cunning vigilante who meticulously hunts down the people responsible. As his thirst for vengeance deepens, Bob uncovers a conspiracy that forces him to decide whether to stop at revenge or expose a web of corruption far darker than he ever imagined.', 
    '2023-09-20', 
    '2024-10-16'
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654451'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'),  
    'School Library: Cashier', 
    'Oswego, NY',
    'handled customer transactions',
    '2024-09-20', 
    '2024-12-02',
    0
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654452'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'),  
    'New York Times: Editing Intern', 
    'New York, NY',
    'Assisted in editing for book reviews',
    '2024-06-02', 
    '2024-8-30',
    1
);

INSERT INTO club (`id`, `student_details_id`, `name`, `start_date`, `end_date`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654453'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'),  
    'The Oswegonian', 
    '2023-9-04',
    '2024-12-04'
);

INSERT INTO interest (`id`, `student_details_id`, `name`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654454'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654441'),  
    'Reading'
);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    13,
    '',
    11, 
    UNHEX('70D5DFB877754F9EB87A1E8C5654440'), 
    6,
    '2024-10-23 00:52:57'
);
INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    11,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5654440'), 
    'SUBMISSION'
);

 -- person 5, Sophomore, yes resume, no internship, no 5 skills
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5652220'), 
    'Sophomore2@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Jane', 
    'Jane', 
    'Sophomore',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5652221'),
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5652221'),
	'00001',
	3.21,
	'Front-End Developer',
	'Sophomore',
	'2027-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5652222'),
	UNHEX('70D5DFB877754F9EB87A1E8C5652221'),
	'Computer Science',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5652223'),
	UNHEX('70D5DFB877754F9EB87A1E8C5652221'),
	'html',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5652224'),
	UNHEX('70D5DFB877754F9EB87A1E8C5652221'),
	'css',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
	UNHEX('70D5DFB877754F9EB87A1E8C5652225'),
	UNHEX('70D5DFB877754F9EB87A1E8C5652221'),
	'English',
    1
);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    14,
    '',
    12, 
    UNHEX('70D5DFB877754F9EB87A1E8C5652220'),
    6,
    '2024-10-23 00:52:57'
);

INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    12,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5652220'), 
    'SUBMISSION'
);

 -- person 6, Sophomore, no resume, no internship, no 5 skills 
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5654500'), 
    'Sophomore3@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Josh', 
    'Josh', 
    'Sophomore',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5654501'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654501'), 
	'11115',
	3.0,
	'Managing',
	'Sophomore',
	'2028-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5654502'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5654501'), 
	'Business',
    0
);

 -- person 7, Junior, yes resume, yes internship, yes 5 skills
 INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5657801'), 
    'Junior1@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Joe', 
    'Joe', 
    'Junior',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'67671',
	3.91,
	'Interested in Politics',
	'Junior',
	'2026-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657803'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'Political Science',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657804'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'Managing',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657805'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'Teamwork',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657806'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'Leadership',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657807'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'Research',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657808'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'Public Speaking',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657809'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
	'English',
    1
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657810'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
    'Bob Jensen for Mayor: Strategy Intern', 
    'Syracuse, NY',
    'Worked on political strategy for a successful mayoral campaign',
    '2023-7-05', 
    '2023-11-21',
    1
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657811'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
    'Kirby Strong for NYS Senate: Intern', 
    'Albany, NY',
    'Worked on secretarial duties',
    '2024-6-05', 
    '2023-8-25',
    1
);

INSERT INTO club (`id`, `student_details_id`, `name`, `start_date`, `end_date`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657812'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
    'College Democrats', 
    '2022-9-04',
    '2024-12-04'
);

INSERT INTO interest (`id`, `student_details_id`, `name`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657813'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657802'), 
    'Politics'
);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    15,
    '',
    13, 
    UNHEX('70D5DFB877754F9EB87A1E8C5657801'),
    6,
    '2024-10-23 00:52:57'
);

INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    13,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5657801'),
    'SUBMISSION'
);

 -- person 8, Junior, yes resume, no internship, no 5 skills
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5658900'), 
    'Junior2@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Jane', 
    'Jane', 
    'Junior',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5658901'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5658901'), 
	'00001',
	4,
	'Future Doctor',
	'Junior',
	'2026-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5658902'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5658901'), 
	'Biology',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5658903'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5658901'), 
	'English',
    1
);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    16,
    '',
    14, 
    UNHEX('70D5DFB877754F9EB87A1E8C5658900'), 
    6,
    '2024-10-23 00:52:57'
);

INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    14,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5658900'), 
    'SUBMISSION'
);

 -- person 9, Junior, no resume, no internship, no 5 skills 
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5657100'), 
    'Junior3@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Josh', 
    'Josh', 
    'Junior',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5657101'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657101'), 
	'11119',
	3.0,
	'Stonks',
	'Junior',
	'2028-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5657102'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5657101'), 
	'Business',
    0
);

 -- person 10, Senior, yes resume, yes internship, yes 5 skills
 INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5653801'), 
    'Senior1@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Joe', 
    'Joe', 
    'Senior',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'00001',
	3.4,
	'Looking for a job as a Software Engineer',
	'Senior',
	'2025-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653803'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'Computer Science',
    0
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653804'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'Communication',
    1
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653805'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'Python',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653806'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'Java',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653807'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'C',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653808'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'React',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653809'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'), 
	'Angular',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653810'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
	'English',
    1
);

INSERT INTO project (`id`, `student_details_id`, `name`, `description`, `start_date`, `end_date`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653811'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
    'e-store', 
    'full-stock app', 
    '2023-09-20', 
    '2023-10-16'
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653812'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
    'Taco Bell: Cashier', 
    'Buffalo, NY',
    'handled customer transactions',
    '2022-06-20', 
    '2022-9-01',
    0
);

INSERT INTO job (`id`, `student_details_id`, `name`, `location`, `description`, `start_date`, `end_date`, `is_coop`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653813'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'), 
    'BoBlox: Software Engineer Intern', 
    'Remote',
    'working on internal tools',
    '2024-5-05', 
    '2024-9-21',
    1
);

INSERT INTO club (`id`, `student_details_id`, `name`, `start_date`, `end_date`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653814'),
    UNHEX('70D5DFB877754F9EB87A1E8C5653802'),
    'Engineering Society', 
    '2021-9-04',
    '2024-9-04'
);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    17,
    '',
    15, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653801'), 
    6,
    '2024-10-23 00:52:57'
);

INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    15,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5653801'),  
    'SUBMISSION'
);

 -- person 11, Senior, yes resume, no internship, no 5 skills
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5656100'), 
    'Senior2@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Jane', 
    'Jane', 
    'Senior',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5656101'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5656101'), 
	'99991',
	3.8,
	'Pursing an MBA',
	'Senior',
	'2026-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5656102'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5656101'), 
	'Business',
    0
);

INSERT INTO `skill` (`id`, `student_details_id`, `name`, `is_language`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5656102'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5656101'),
	'English',
    1
);

INSERT INTO submission (`id`, `comment`, `artifact_id`, `student_id`, `task_id`, `submission_date`)
VALUES (
    18,
    '',
    16, 
    UNHEX('70D5DFB877754F9EB87A1E8C5656100'), 
    6,
    '2024-10-23 00:52:57'
);

INSERT INTO artifact (`id`, `name`, `file_location`, `user_id`, `type`)
VALUES (
    16,
	'jakesresume', 
    'C:\\Users\\ABSan\\OneDrive\\Desktop\\oswego-career-dashboard\\uploads\\jakes.pdf',
    UNHEX('70D5DFB877754F9EB87A1E8C5656100'), 
    'SUBMISSION'
);


 -- person 12, Senior, no resume, no internship, no 5 skills 
INSERT INTO `user` (`id`, `email`, `phone_number`, `last_login`, `date_created`, `first_name`, `preferred_name`, `last_name`, `can_email`, `can_text`, `student_details_id`, `role`, `signed_up`) 
 VALUES ( 
    UNHEX('70D5DFB877754F9EB87A1E8C5653100'), 
    'Senior3@gmail.com', 
    '111-111-1111', 
    '2023-01-01 00:00:00', 
    '2023-01-01 00:00:00', 
    'Josh', 
    'Josh', 
    'Senior',
    1, 
    1, 
    UNHEX('70D5DFB877754F9EB87A1E8C5653101'), 
    'Student', 
    1 
);

INSERT INTO `student_details` (`id`, `university_id`, `gpa`, `description`, `year_level`, `graduation_year`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653101'), 
	'11118',
	3.77,
	'Math is cool',
	'Junior',
	'2025-01-01 00:00:00'
);

INSERT INTO `degree_program` (`id`, `student_details_id`, `name`, `is_minor`)
VALUES (
    UNHEX('70D5DFB877754F9EB87A1E8C5653102'), 
    UNHEX('70D5DFB877754F9EB87A1E8C5653101'), 
	'Math',
    0
);