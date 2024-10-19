from fastapi import APIRouter, Depends, Query 
from dependency_injector.wiring import inject, Provide
from src.config.container import Container
from fastapi import Depends

#ロガーを定義する
import logging
logger = logging.getLogger(__name__)

account_view_router = APIRouter()

@account_view_router.get("/account/find_allocation_by_team_id_and_user_email")
@inject
async def get_allocation_by_team_id_and_user_email(team_id: int = Query(...),
        email: str = Query(...), service = Depends(Provide[Container.allocation_service])):
    res = service.findAllocationByTeamIdAndUserEmail(team_id=team_id, email=email)
    return {"message": "Getting entity succeeded", "result":res}

@account_view_router.get("/account/get_user/{id}")
@inject
async def get_user_by_id(id: int, service = Depends(Provide[Container.allocation_service])):
    res = service.findAppUserById(id)
    return {"message": "Getting entity succeeded","result": res}

@account_view_router.get("/account/get_team/{id}")
@inject
async def get_team_by_id(id: int, service = Depends(Provide[Container.allocation_service])):
    res = service.findAppTeamById(id)
    return {"message": "Getting entity succeeded", "result":res}

@account_view_router.get("/account/get_allocation/{id}")
@inject
def get_allocation_by_id(id: int, service = Depends(Provide[Container.allocation_service])):
    res = service.findAllocationById(id)
    return {"message": "Getting entity succeeded", "result":res}

@account_view_router.get("/account/show_passcode_by_team_id/{id}")
@inject
async def show_passcode_by_team_id(id: int, service = Depends(Provide[Container.allocation_service])):
    res = service.exportPassCodeByTeamId(id)
    return {"message": "Passcode encoding succeeded", "result":res}