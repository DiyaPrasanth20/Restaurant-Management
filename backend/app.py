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


@app.route('/restaurants', methods=['GET'])
def get_matching_restaurants():
    try:
        cuisine_type = request.args.get('cuisine')
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            database='BooknDine'
        )
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM restaurants WHERE cuisine_type = %s;", (cuisine_type,))
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



if __name__ == '__main__':
    app.run(debug=True)
