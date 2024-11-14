def test_data_structures():
    data1 = {
    "All": {
        "Total": {"Count": 28, "has_resume": 19, "has_internship": 16, "done_internship_this_year": 14, "done_internship_last_year": 7 },
        "Freshman": {"Count": 7, "has_resume": 5, "has_internship": 3, "done_internship_this_year": 3, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 7, "has_resume": 6, "has_internship": 4, "done_internship_this_year": 3, "done_internship_last_year": 3 },
        "Junior": {"Count": 7, "has_resume": 5, "has_internship": 4, "done_internship_this_year": 3, "done_internship_last_year": 3 },
        "Senior": {"Count": 7, "has_resume": 3, "has_internship": 5, "done_internship_this_year": 5, "done_internship_last_year": 1 }
    },
    "Accounting": {
        "Total": {"Count": 4, "has_resume": 2, "has_internship": 2, "done_internship_this_year": 2, "done_internship_last_year": 1 },
        "Freshman": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 1 },
        "Junior": {"Count": 1, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 1, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Business Administration": {
        "Total": {"Count": 4, "has_resume": 3, "has_internship": 4, "done_internship_this_year": 3, "done_internship_last_year": 1 },
        "Freshman": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 },
        "Junior": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 0, "done_internship_last_year": 1 },
        "Senior": {"Count": 1, "has_resume": 0, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 }
    },
    "Finance": {
        "Total": {"Count": 4, "has_resume": 4, "has_internship": 3, "done_internship_this_year": 3, "done_internship_last_year": 2 },
        "Freshman": {"Count": 1, "has_resume": 1, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 1 },
        "Junior": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 1 },
        "Senior": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 }
    },
    "Human Resource Management": {
        "Total": {"Count": 3, "has_resume": 2, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 },
        "Freshman": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 1, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 1, "has_resume": 1, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 1, "has_resume": 0, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 1 }
    },
    "Marketing": {
        "Total": {"Count": 4, "has_resume": 2, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 1 },
        "Freshman": {"Count": 1, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 1, "has_resume": 1, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 1 },
        "Senior": {"Count": 1, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    },
    "Operations Management and Information Systems": {
        "Total": {"Count": 4, "has_resume": 3, "has_internship": 2, "done_internship_this_year": 1, "done_internship_last_year": 1},
        "Freshman": {"Count": 1, "has_resume": 1, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 0, "done_internship_last_year": 1 },
        "Junior": {"Count": 1, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Senior": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 }
    },
    "Risk Management and Insurance": {
        "Total": {"Count": 4, "has_resume": 3, "has_internship": 2, "done_internship_this_year": 1, "done_internship_last_year": 0 },
        "Freshman": {"Count": 1, "has_resume": 0, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Sophomore": {"Count": 1, "has_resume": 1, "has_internship": 0, "done_internship_this_year": 0, "done_internship_last_year": 0 },
        "Junior": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 1, "done_internship_last_year": 0 },
        "Senior": {"Count": 1, "has_resume": 1, "has_internship": 1, "done_internship_this_year": 0, "done_internship_last_year": 0 }
    }
}