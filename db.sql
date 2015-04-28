## SQLITE3

CREATE TABLE experiment (
	id INTEGER PRIMARY KEY,
	sex TEXT,
	age INTEGER,
	student TEXT,
	task1_group TEXT,
	task1_1 TEXT,
	task1_2 TEXT,
	task1_3 TEXT,
	task2_group TEXT,
	task2_1 INTEGER,
	task2_2 INTEGER,
	task2_3 INTEGER
);

#insert into experiment
#	(sex, age, task1_group, task1_1, task1_2, task1_3, task2_group, task2_1, task2_2, task2_3) 
#	values
#	("m", "876", "success", "T", "T", "T", "success", "934", "1093", "1487");
