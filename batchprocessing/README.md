# Explainer

The purpose of **process.py** is to output a json file populated with data that is used for our analytics dashboard.  **output.json** is the json file that is created.  **mockdata.sql** is an sql file with commands to populate the db with testable data.  **iterateThroughUsers.sql** is a stored procedure that processes the data in the db, creating the data that will be used for data analytics.

The data that is saved is in the format:

![image](https://github.com/user-attachments/assets/c01a0191-695d-4e77-8fc8-dca94d735a2e)

It sorts the data by year and also has the total count of students.  In order, the data that is stored is has uploaded a resume, has had an internship, has 5 or more skills.

# To Do

[SP-87](https://himeluddin.atlassian.net/browse/SP-87?atlOrigin=eyJpIjoiZjlmZGJkNmQwZWNhNDY1YTlkN2ExYzhkYmI3YmM2MjYiLCJwIjoiaiJ9)

Make python script runnable in Java: https://www.baeldung.com/run-shell-command-in-java

Set up scheduling to run once a day: https://www.baeldung.com/spring-scheduling-annotations
