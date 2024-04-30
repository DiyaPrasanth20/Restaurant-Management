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


-- Insert data into the `restaurants` table
INSERT INTO restaurants (name, rating, city, max_price, dress_code, cuisine_type) VALUES
('American Grill', 4.7, 'Chicago', 60.00, 'yes', 'American'),
('Austin Pasta House', 4.6, 'Austin', 60.00, 'yes', 'Italian'),
('Austin Steakhouse', 4.8, 'Austin', 70.00, 'yes', 'American'),
('BBQ Barn', 4.2, 'San Francisco', 40.00, 'yes', 'American'),
('Burrito Bonanza', 4.1, 'Austin', 25.00, 'no', 'Mexican'),
('Chicago Grill', 3.9, 'Chicago', 45.00, 'yes', 'American'),
('Chopstick House', 3.8, 'Austin', 30.00, 'no', 'Chinese'),
('Fresh Bistro', 4.5, 'New York City', 70.00, 'yes', 'French'),
('Golden Dragon', 4.2, 'Chicago', 40.00, 'yes', 'Chinese'),
('Italiano', 4.6, 'San Francisco', 55.00, 'yes', 'Italian'),
('MexiCasa', 3.9, 'Chicago', 40.00, 'no', 'Mexican'),
('Noodle House', 3.5, 'San Francisco', 35.00, 'yes', 'Chinese'),
('Pasta Paradise', 4.5, 'Chicago', 50.00, 'yes', 'Italian'),
('Pizza Pizzazz', 4.3, 'Chicago', 45.00, 'no', 'Italian'),
('Pizzeria', 4.1, 'San Francisco', 30.00, 'no', 'Italian'),
('San Fran Burritos', 4.4, 'San Francisco', 45.00, 'yes', 'Mexican'),
('Taco Time', 4.0, 'Austin', 35.00, 'no', 'Mexican'),
('Tex-Mex Tavern', 3.7, 'Austin', 30.00, 'no', 'Mexican'),
('Wok Wonders', 4.4, 'Chicago', 50.00, 'yes', 'Chinese');



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

-- SQL to insert values into the 'availabilities' table
INSERT INTO availabilities (availability_id, restaurant_name, date, num_tables_open) VALUES
(1, 'American Grill', 'May 20', 2),
(2, 'American Grill', 'May 21', 2),
(3, 'Austin Pasta House', 'May 20', 2),
(4, 'Austin Pasta House', 'May 21', 2),
(5, 'Austin Steakhouse', 'May 20', 2),
(6, 'Austin Steakhouse', 'May 21', 2),
(7, 'BBQ Barn', 'May 20', 2),
(8, 'BBQ Barn', 'May 21', 2),
(9, 'Burrito Bonanza', 'May 20', 2),
(10, 'Burrito Bonanza', 'May 21', 2),
(11, 'Chicago Grill', 'May 20', 2),
(12, 'Chicago Grill', 'May 21', 2),
(13, 'Chopstick House', 'May 20', 2),
(14, 'Chopstick House', 'May 21', 2),
(15, 'Fresh Bistro', 'May 20', 2),
(16, 'Fresh Bistro', 'May 21', 2),
(17, 'Golden Dragon', 'May 20', 2),
(18, 'Golden Dragon', 'May 21', 2),
(19, 'Italiano', 'May 20', 2),
(20, 'Italiano', 'May 21', 2),
(21, 'MexiCasa', 'May 20', 2),
(22, 'MexiCasa', 'May 21', 2),
(23, 'Noodle House', 'May 20', 2),
(24, 'Noodle House', 'May 21', 2),
(25, 'Pasta Paradise', 'May 20', 2),
(26, 'Pasta Paradise', 'May 21', 2),
(27, 'Pizza Pizzazz', 'May 20', 2),
(28, 'Pizza Pizzazz', 'May 21', 2),
(29, 'Pizzeria', 'May 20', 2),
(30, 'Pizzeria', 'May 21', 2),
(31, 'San Fran Burritos', 'May 20', 2),
(32, 'San Fran Burritos', 'May 21', 2),
(33, 'Taco Time', 'May 20', 2),
(34, 'Taco Time', 'May 21', 2),
(35, 'Tex-Mex Tavern', 'May 20', 2),
(36, 'Tex-Mex Tavern', 'May 21', 2),
(37, 'Wok Wonders', 'May 20', 2),
(38, 'Wok Wonders', 'May 21', 2);



---------- to reset reservation table primary key ----------------

ALTER TABLE reservation AUTO_INCREMENT = 1;



------------ to reset num_tables_open to 2 in availabilities table ----------

UPDATE availabilities
SET num_tables_open = 2;



------------ to delete reservation table ---------
DELETE FROM reservation; 

