import mysql.connector
import getpass
import json

# Configuration for MySQL connection
db_config = {
    'user': 'backend',
    'password': 'password',  # Secure password input
    'host': 'localhost',
    'port': 3306,
    'database': 'crd'
}

connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()
cursor.callproc('IterateThroughUsers')

data = {
    "All": {
        "Total": {"Count": 0,"has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": { "Count": 0,"has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Accounting": {
        "Total": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Business Administration": {
        "Total": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Finance": {
        "Total": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Human Resource Management": {
        "Total": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Marketing": {
        "Total": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Operations Management and Information Systems": {
        "Total": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Risk Management and Insurance": {
        "Total": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Freshman": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 0, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    }
}



# Process each result set from the stored procedure
for result in cursor.stored_results():
    rows = result.fetchall()
    for row in rows:
        print(row)

        Major = row[0]
        Year = row[1]
        Resume = row[2]
        Internship = row[3]
        InternshipThisYear = row[4]
        InternshipLastYear = row[5]

        if Major == '' or Year == '':
            continue
        

        #('Business Administration','Freshman', 1, 1, 1, 0)

        data['All']['Total']['Count'] += 1
        data['All']['Total']['has_resume'] += Resume
        data['All']['Total']['has_internship'] += Internship
        data['All']['Total']['done_internship_this_year'] += InternshipThisYear
        data['All']['Total']['done_internship_last_year'] += InternshipLastYear

        data['All'][Year]['Count'] += 1
        data['All'][Year]['has_resume'] += Resume
        data['All'][Year]['has_internship'] += Internship
        data['All'][Year]['done_internship_this_year'] += InternshipThisYear
        data['All'][Year]['done_internship_last_year'] += InternshipLastYear


        data[Major]['Total']['Count'] += 1
        data[Major]['Total']['has_resume'] += Resume
        data[Major]['Total']['has_internship'] += Internship
        data[Major]['Total']['done_internship_this_year'] += InternshipThisYear
        data[Major]['Total']['done_internship_last_year'] += InternshipLastYear

        data[Major][Year]['Count'] += 1
        data[Major][Year]['has_resume'] += Resume
        data[Major][Year]['has_internship'] += Internship
        data[Major][Year]['done_internship_this_year'] += InternshipThisYear
        data[Major][Year]['done_internship_last_year'] += InternshipLastYear


json_output = json.dumps(data, indent=4)

with open('output.json', 'w') as json_file:
    json_file.write(json_output)

print("Data has been saved to output.json")
