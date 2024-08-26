from config import db, app

class UserData(db.Model):
    user_id = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(10), unique=False, nullable=False)
    status = db.Column(db.String(100), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)

    def to_json(self):
        return {
            "userID": self.user_id,
            "name": self.name,
            "status": self.status,
            "price": self.price,
        }

class TicketSale(db.Model):
    __abstract__ = True
    user_id = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(10), db.ForeignKey('user_data.name'))
    status = db.Column(db.String(15), db.ForeignKey('user_data.status'))
    price = db.Column(db.Integer, db.ForeignKey('user_data.price'))
    ticket_number = db.Column(db.Integer, unique=False, nullable=False)

    def to_json(self):
        return {
            "userID": self.user_id,
            "name": self.name,
            "status": self.status,
            "price": self.price,
            "ticketNumber": self.ticket_number,
        }