# Assuming you have a Flask app and a SQLAlchemy setup
from config import app, db
from models import TicketSale
import json

# Create your Flask application instance
app_1 = app

def export_to_json():
    with app_1.app_context():  # Create an application context
        # Fetch all records from the TicketSale table
        ticket_sales = TicketSale.query.all()

        # Convert the list of TicketSale objects to a list of dictionaries
        ticket_sales_list = [ticket.to_json() for ticket in ticket_sales]

        # Convert the list of dictionaries to a JSON string
        ticket_sales_json = json.dumps(ticket_sales_list, ensure_ascii=False, indent=4)

        # Write the JSON string to a file
        with open('ticket_sales.json', 'w', encoding='utf-8') as json_file:
            json_file.write(ticket_sales_json)

# Call the function to export data to JSON
export_to_json()