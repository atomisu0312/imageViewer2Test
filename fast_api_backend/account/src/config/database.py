from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from contextlib import contextmanager, AbstractContextManager  
from typing import Callable
import os
import dotenv

Base = declarative_base()

class Database:
  def __init__(self):
    dotenv.load_dotenv()
    
    # settings of test database
    SQLALCHEMY_DATABASE_URL = 'postgresql+psycopg2://{user}:{password}@{host}/{database}'.format(
    **{
    'user': os.getenv('PG_DB_USER', 'sample_user'),
    'password': os.getenv('PG_DB_PASSWORD', 'password'),
    'host': os.getenv('PG_DB_HOST', 'localhost:5432'),
    'database': os.getenv('PG_DB_NAME', 'schema'),
    })
    
    self._engine = create_engine(
    SQLALCHEMY_DATABASE_URL, echo=True, connect_args={
        'options': '-c search_path={schema}'.format(
            schema=os.getenv('DB_SCHEMA', 'image')
        )
        }
    )
    self._session_factory =sessionmaker(autocommit=False, autoflush=False, bind=self._engine)
  
  @contextmanager
  def session(self) -> Callable[..., AbstractContextManager[Session]]:
    session: Session = self._session_factory()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()