from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import dotenv
import os

dotenv.load_dotenv(dotenv.find_dotenv())


user = os.getenv("user")
password = os.getenv("password")
database = "database"
host = "localhost"

SQLALCHEMY_DATABASE_URL = f"postgresql://{user}:{password}@{host}/{database}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker( autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()