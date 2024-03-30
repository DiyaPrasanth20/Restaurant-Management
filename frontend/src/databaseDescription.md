Database Name: BooknDine 

Database Schema:

CREATE TABLE restaurant ( name TEXT PRIMARY KEY, rating NUMERIC,
city TEXT,
max_price NUMERIC, dress_code TEXT, cuisine_type TEXT
);

CREATE TABLE reservation (
reservation_code INTEGER PRIMARY KEY AUTOINCREMENT, restaurant_name TEXT, -- Foreign key referencing restaurant.name notes TEXT,
booking_date TEXT,
booking_time TEXT,
FOREIGN KEY (restaurant_name) REFERENCES restaurant(name)
);


CREATE TABLE availabilities (
availability_id INTEGER PRIMARY KEY AUTOINCREMENT, restaurant_name TEXT, -- Foreign key referencing restaurant.name date TEXT,
time TEXT,
num_tables_open INTEGER,
FOREIGN KEY (restaurant_name) REFERENCES restaurant(name)
);