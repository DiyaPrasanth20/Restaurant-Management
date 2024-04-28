from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

# Allow cross-origin requests from the React frontend
CORS(app)

@app.route('/cuisine_types', methods=['GET'])
def get_cuisine_types():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor()
        cursor.execute("SELECT DISTINCT cuisine_type FROM restaurants;")
        cuisine_types = [row[0] for row in cursor.fetchall()]
        response =  jsonify(cuisine_types)
        return response
    except Exception as e:
        error_message = "An error occurred while fetching cuisine types."
        return jsonify({'error': error_message}), 500  # Return JSON error response with status code 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()




@app.route('/locations', methods=['GET'])
def get_locations():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor()
        cursor.execute("SELECT DISTINCT city FROM restaurants;")
        locations = [row[0] for row in cursor.fetchall()]
        response = jsonify(locations)
        return response
    except Exception as e:
        error_message = "An error occurred while fetching locations."
        return jsonify({'error': error_message}), 500  # Return JSON error response with status code 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()



@app.route('/restaurants', methods=['GET'])
def get_matching_restaurants():
    try:
        cuisine_type = request.args.get('cuisine')
        max_price = request.args.get('max_price')  # Get the max_price parameter
        city =  request.args.get('city')
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor(dictionary=True)
        # Modify the SQL query to include both cuisine type and max price conditions
        cursor.execute("SELECT * FROM restaurants WHERE cuisine_type = %s AND max_price <= %s AND city = %s;", (cuisine_type, max_price, city))
        matching_restaurants = cursor.fetchall()
        return jsonify(matching_restaurants)
    except Exception as e:
        error_message = "An error occurred while fetching matching restaurants."
        return jsonify({'error': error_message}), 500  # Return JSON error response with status code 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()






#for the BookPage.js
@app.route('/restaurant_names', methods=['GET'])
def fetch_restaurant_names():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor()
        cursor.execute("SELECT DISTINCT restaurant_name FROM availabilities WHERE num_tables_open >= 1;")
        cuisine_types = [row[0] for row in cursor.fetchall()]
        response =  jsonify(cuisine_types)
        return response
    except Exception as e:
        error_message = "An error occurred while fetching restaurant_names"
        return jsonify({'error': error_message}), 500  # Return JSON error response with status code 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()


@app.route('/dates', methods=['GET'])
def fetch_dates():
    try:
        restaurant_name = request.args.get('restaurant_name')
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor()
        cursor.execute("SELECT DISTINCT date FROM availabilities WHERE restaurant_name = %s AND num_tables_open >= 1;", (restaurant_name,))
        dates = [row[0] for row in cursor.fetchall()]
        response = jsonify(dates)
        return response
    except Exception as e:
        error_message = "An error occurred while fetching dates."
        return jsonify({'error': error_message}), 500  # Return JSON error response with status code 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()




# Define the stored procedure creation query
create_proc_query = """
CREATE PROCEDURE book_table_proc(
    IN p_restaurant_name VARCHAR(255),
    IN p_date VARCHAR(20),
    IN p_occasion TEXT,
    OUT p_reservation_code INT
)
BEGIN
    -- Declare variables for error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback the transaction if an error occurs
        ROLLBACK;
        -- Return a negative reservation code to indicate failure
        SET p_reservation_code = -1;
    END;

    -- Start the transaction
    START TRANSACTION;

    -- Try updating the availability table
    UPDATE availabilities 
    SET num_tables_open = num_tables_open - 1 
    WHERE restaurant_name = p_restaurant_name AND date = p_date;

    -- Check if update was successful
    IF ROW_COUNT() = 0 THEN
        -- Rollback and return negative reservation code if no rows were updated
        ROLLBACK;
        SET p_reservation_code = -1;
    END IF;

    -- Prepare and execute insert statement
    SET stmt_insert = CONCAT('INSERT INTO reservation (restaurant_name, booking_date, occasion) VALUES (?, ?, ?)');
    PREPARE insert_stmt FROM stmt_insert;
    SET @res_occasion = p_occasion;
    EXECUTE insert_stmt USING @res_name, @res_date, @res_occasion;
    DEALLOCATE PREPARE insert_stmt;

    -- Get the last inserted reservation code
    SET p_reservation_code = LAST_INSERT_ID();

    -- Commit the transaction
    COMMIT;

    -- Return the reservation code
    SELECT p_reservation_code AS message;
END;
"""

# Define the route
@app.route('/book-table', methods=['PUT'])
def book_table():
    try:
        restaurant_name = request.args.get('restaurant_name')
        date = request.args.get('date')
        occasion = request.args.get('occasion')

        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor()

        # Check if the stored procedure exists
        cursor.execute("SHOW PROCEDURE STATUS LIKE 'book_table_proc'")
        procedure_exists = cursor.fetchone()

        # If the procedure doesn't exist, create it
        if not procedure_exists:
            cursor.execute(create_proc_query)

        # Call the stored procedure
        cursor.callproc("book_table_proc", (restaurant_name, date, occasion, 0))

        # Get the output parameter (reservation_code)
        for result in cursor.stored_results():
            reservation_code = result.fetchone()[0]

        return jsonify({'success': True, 'reservation_code': reservation_code}), 200
    except Exception as e:
        error_message = "An error occurred while booking table: " + str(e)
        print("Error:", e)  # Print the error message to debug
        return jsonify({'error': error_message}), 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()







if __name__ == '__main__':
    app.run(debug=True)