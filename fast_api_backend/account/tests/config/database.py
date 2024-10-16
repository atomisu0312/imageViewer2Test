import os
import dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from contextlib import contextmanager, AbstractContextManager  
from typing import Callable
from src.entity.entity import Entity
from src.main import app
from dependency_injector import providers

class DatabaseForTest:
  def __init__(self):
    dotenv.load_dotenv()
    # settings of test database
    TEST_SQLALCHEMY_DATABASE_URL = 'postgresql+psycopg2://{user}:{password}@{host}/{database}'.format(
    **{
    'user': os.getenv('PG_DB_USER', 'sample_user'),
    'password': os.getenv('PG_DB_PASSWORD', 'password'),
    'host': os.getenv('PG_DB_HOST', 'localhost:5432'),
    'database': os.getenv('PG_DB_DATABASE_TEST', 'test_schema'),
    })
    
    self._engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL, echo=True, connect_args={
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

def temp_db_container(f):
  def func(*args, **kwargs):
    db = DatabaseForTest()
    Entity.metadata.create_all(db._engine)
  
    # 既存のコンテナを取得
    original_container = app.container
      
    test_db = providers.Singleton(DatabaseForTest)
    original_container.db.override(test_db)
      
    try:
      # Run tests
      f(*args, **kwargs)
    finally:
      Entity.metadata.drop_all(db._engine)
      # データベース接続を元に戻す
      original_container.db.reset_override()
  return func
