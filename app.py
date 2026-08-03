from database import Base, engine
from models import Gift

Base.metadata.create_all(engine)