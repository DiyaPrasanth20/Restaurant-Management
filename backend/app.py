from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)


CORS(app)




def create_indexes():
    try:
        db_config = {
            'host': 'localhost',
            'user': 'root',
            'database': 'BooknDine'
        }
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        
        
        cursor.execute("SHOW INDEX FROM reservation WHERE Key_name = 'idx_reservation_code'")
        result = cursor.fetchone()
        if not result:
            cursor.execute("CREATE INDEX idx_reservation_code ON reservation (reservation_code)")
        cursor.fetchall() 

    
        cursor.execute("SHOW INDEX FROM availabilities WHERE Key_name = 'idx_restaurant_name_date'")
        result = cursor.fetchone()
        if not result:
            cursor.execute("CREATE INDEX idx_restaurant_name_date ON availabilities (restaurant_name(255), date(255))")
        cursor.fetchall() 

        
        cursor.execute("SHOW INDEX FROM restaurants WHERE Key_name = 'idx_cuisine'")
        result = cursor.fetchone()
        if not result:
            cursor.execute("CREATE INDEX idx_cuisine ON restaurants (cuisine_type)")
        cursor.fetchall()  


        connection.commit()
        cursor.close()
        connection.close()
        print("Indexes created successfully.")
    except Exception as e:
        print("Error creating indexes:", e)


create_indexes()


###################### FILTERING ##############################

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
        return jsonify({'error': error_message}), 500 
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
        return jsonify({'error': error_message}), 500  
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()



@app.route('/restaurants', methods=['GET'])
def get_matching_restaurants():
    try:
        cuisine_type = request.args.get('cuisine')
        max_price = request.args.get('max_price')  
        city =  request.args.get('city')
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM restaurants WHERE cuisine_type = %s AND max_price <= %s AND city = %s;", (cuisine_type, max_price, city))
        matching_restaurants = cursor.fetchall()
        return jsonify(matching_restaurants)
    except Exception as e:
        error_message = "An error occurred while fetching matching restaurants."
        return jsonify({'error': error_message}), 500  
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()




################################ BOOKING ##############################

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
        return jsonify({'error': error_message}), 500 
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
        return jsonify({'error': error_message}), 500  
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()





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
    SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

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

       
        cursor.execute("SHOW PROCEDURE STATUS LIKE 'book_table_proc'")
        procedure_exists = cursor.fetchone()

       
        if not procedure_exists:
            cursor.execute(create_proc_query)

       
        cursor.callproc("book_table_proc", (restaurant_name, date, occasion, 0))

    
        for result in cursor.stored_results():
            reservation_code = result.fetchone()[0]

        return jsonify({'success': True, 'reservation_code': reservation_code}), 200
    except Exception as e:
        error_message = "An error occurred while booking table: " + str(e)
        print("Error:", e) 
        return jsonify({'error': error_message}), 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()



##############FOR DELETION ###############################


create_another_proc_query = """
CREATE PROCEDURE delete_reservation_proc(
    IN p_reservation_code INT,
    OUT p_status INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback the transaction if an error occurs
        ROLLBACK;
        SET p_status = -1;  -- Indicates an error occurred
    END;

    -- Start the transaction
    START TRANSACTION;
    SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

    -- Check if reservation exists
    SELECT restaurant_name, booking_date
    INTO @restaurant_name, @booking_date
    FROM reservation
    WHERE reservation_code = p_reservation_code
    FOR UPDATE;

    -- If no reservation found, rollback and set success status to false
    IF ROW_COUNT() = 0 THEN
        ROLLBACK;
        SET p_status = 0;  -- Indicates no reservation found
    ELSE
        -- Delete the reservation
        DELETE FROM reservation WHERE reservation_code = p_reservation_code;

        -- Update the availabilities
        UPDATE availabilities
        SET num_tables_open = num_tables_open + 1
        WHERE restaurant_name = @restaurant_name AND date = @booking_date;

        -- Commit the transaction
        COMMIT;
        SET p_status = 1;  -- Indicates success
    END IF;
    SELECT p_status AS message;
END;
"""

@app.route('/delete-reservation/<int:reservation_code>', methods=['DELETE'])
def delete_reservation(reservation_code):
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor()
        cursor.execute("SHOW PROCEDURE STATUS LIKE 'delete_reservation_proc'")
        procedure_exists = cursor.fetchone()


        if not procedure_exists:
            cursor.execute(create_another_proc_query)

        
        result_args = [reservation_code, 500]  
        cursor.callproc("delete_reservation_proc", result_args)
        
        status = result_args[1]  
        print(result_args)

        for result in cursor.stored_results():
            
            status = result.fetchall()[0][0]

        print(status)
    
        if status == 1:
            message = 'Reservation deleted successfully'
            return_code = 200
        elif status == 0:
            message = 'Invalid reservation code'
            return_code = 404
        else:
            message = 'An error occurred while deleting the reservation'
            return_code = 500

        connection.commit()
        return jsonify({'success': status == 1, 'message': message}), return_code

    except Exception as e:
        error_message = "An error occurred while deleting reservation: " + str(e)
        print("Error:", e) 
        return jsonify({'error': error_message}), 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()






###############FOR UPDATES ########################

@app.route('/update-occasion', methods=['PUT'])
def update_occasion():
    reservation_code = int(request.args.get('reservationCode'))
    occasion = request.args.get('occasion')
    connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
    cursor = connection.cursor()
    
    '''
    statement = f"UPDATE reservation SET occasion = \'{occasion}\' WHERE reservation_code = {reservation_code};"
    print(statement)
    cursor.execute(statement)

    '''
    statement_check = f"SELECT * FROM reservation WHERE reservation_code = {reservation_code}"
    cursor.execute(statement_check)
    result = cursor.fetchall()
    print(result)
    if result == None or len(result) < 1:
        return jsonify({'reserve': False}), 200


    statement = "UPDATE reservation SET occasion = %s WHERE reservation_code = %s"
    cursor.execute(statement, (occasion, reservation_code))
    connection.commit()
    status = cursor.fetchall()
    connection.commit()
    return jsonify({'reserve': True}), 200






if __name__ == '__main__':
    app.run(debug=True)