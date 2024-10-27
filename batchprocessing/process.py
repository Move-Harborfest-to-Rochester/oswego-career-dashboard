import mysql.connector
import getpass
import json

# Configuration for MySQL connection
db_config = {
    'user': 'root',
    'password': getpass.getpass("Enter your MySQL password: "),  # Secure password input
    'host': 'localhost',
    'port': 3306,
    'database': 'crd'
}

connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()
cursor.callproc('IterateThroughUsers')

# 0: has resume
# 1: has internship
# 2: has 5 or more skills
data = {
    'Total': [0, 0, 0],
    'Freshman': [0, 0, 0],
    'Sophomore': [0, 0, 0],
    'Junior': [0, 0, 0],
    'Senior': [0, 0, 0]
}
count = 0

# Process each result set from the stored procedure
for result in cursor.stored_results():
    rows = result.fetchall()
    for row in rows:

        Year = row[0]
        Resume = row[1]
        Internship = row[2]
        Skill = row[3]
        
        data[Year][0] += Resume
        data['Total'][0] += Resume

        data[Year][1] += Internship
        data['Total'][1] += Internship

        data[Year][2] += Skill
        data['Total'][2] += Skill

        count += 1

data['Count'] = count

json_output = json.dumps(data, indent=4)

with open('output.json', 'w') as json_file:
    json_file.write(json_output)

print("Data has been saved to output.json")
