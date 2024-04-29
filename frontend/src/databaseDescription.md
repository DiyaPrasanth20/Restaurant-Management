Database Name: BooknDine 

Database Schema:

CREATE TABLE restaurants ( 
    name TEXT PRIMARY KEY, 
    rating NUMERIC,
    city TEXT, 
    max_price NUMERIC, 
    dress_code TEXT, 
    cuisine_type TEXT
);

CREATE TABLE reservation (
reservation_code INTEGER PRIMARY KEY AUTOINCREMENT, 
restaurant_name TEXT, -- Foreign key referencing restaurant.name notes TEXT,
booking_date TEXT,
FOREIGN KEY (restaurant_name) REFERENCES restaurants(name)
);


CREATE TABLE availabilities (
availability_id INTEGER PRIMARY KEY AUTOINCREMENT, 
restaurant_name TEXT, -- Foreign key referencing restaurant.name date TEXT,
date TEXT,
num_tables_open INTEGER,
FOREIGN KEY (restaurant_name) REFERENCES restaurants(name)
);



---------- to reset reservation table primary key ----------------

ALTER TABLE reservation AUTO_INCREMENT = 1;