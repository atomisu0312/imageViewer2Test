from fastapi import Depends, FastAPI, HTTPException

from src.config.container import Container
from src.endpoints.welcome import welcome_router
import logging

def createApp() -> FastAPI:
    # ロガーの設定
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler()
        ]
    )
    
    container = Container()
    app = FastAPI()
    app.container = container
    app.include_router(welcome_router)  
    
    return app

app = createApp()




