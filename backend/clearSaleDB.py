from config import db, app
from models import TicketSale
from datetime import datetime

month = f'{datetime.now().month:02}'
date = f'{datetime.now().day:02}'
table_name = f'ticketsale_{month}_{date}'
ticket_sale = type(table_name, (TicketSale,), {'__tablename__': table_name})

def delete_all_ticket_sales():
    global ticket_sale
    with app.app_context():
        try:
            # Delete all records in the TicketSale table
            db.session.query(ticket_sale).delete()
            # Commit the changes to the database
            db.session.commit()
            print("All records in TicketSale have been deleted.")
        except Exception as e:
            # Rollback in case of any error
            db.session.rollback()
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    delete_all_ticket_sales()