import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()

db_url = os.environ.get('DATABASE_URL')
engine = create_engine(db_url)

SessionLocal = sessionmaker(bind=engine,autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

