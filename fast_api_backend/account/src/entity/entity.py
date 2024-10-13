from sqlalchemy import Column, DateTime, Integer, String, func
from src.config.database import Base
from datetime import datetime

DEFAULT_DATA_OWNER = "system"
class Entity(Base):
    __abstract__ = True  # 抽象基底クラスとして定義
    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    dataowner = Column(String, default=DEFAULT_DATA_OWNER)
    regist_date = Column(DateTime, default=func.now())
    enable_start_date = Column(DateTime, default=func.now())
    enable_end_date = Column(DateTime, default=datetime(9999, 12, 31))
    version = Column(Integer, nullable=False)  # デフォルト値を設定
    __mapper_args__ = {
        'version_id_col': version,
    }