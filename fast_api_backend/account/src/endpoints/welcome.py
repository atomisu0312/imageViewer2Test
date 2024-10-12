from fastapi import APIRouter, Depends, Response, status  
from dependency_injector.wiring import inject, Provide
from src.config.container import Container, TestClassA

from src.service.team_allocation import TeamAllocationService

from src.endpoints.schema.welcome_schema import NewTeamAndUserRequest, NewFollowingUserRequest

from fastapi import Depends, FastAPI, HTTPException, Body, status

#ロガーを定義する
import logging
logger = logging.getLogger(__name__)


import os
import dotenv
welcome_router = APIRouter()

@welcome_router.get("/welcome/some_user")
@inject
def get_some_user(service :TeamAllocationService = Depends(Provide[Container.allocation_service])):
    return service.findAppUserById(1)

@welcome_router.get("/")
@inject
def hello(testc: TestClassA = Depends(Provide[Container.test])):
    assert testc.a == "a"
    return {"message": "Hello World"}

@welcome_router.post("/welcome/new_team_and_user")
@inject
async def create_new_team_and_user(request: NewTeamAndUserRequest = Body(...), service = Depends(Provide[Container.allocation_service])):
    res = service.createUserWithNewTeam(team_name = request.team_name, user_name = request.user_name, user_email = request.email)   
    return {"message": "Inserted", "result": res}

@welcome_router.post("/welcome/new_following_user")
@inject
async def create_new_following_user(request: NewFollowingUserRequest = Body(...), service = Depends(Provide[Container.allocation_service])):    
    res = service.createUserWithExistingTeamWithPassCode(user_name = request.user_name, user_email = request.email, passcode = request.pass_code)
    return {"message": "Inserted","result":res}

@welcome_router.get("/account/get_user/{id}")
@inject
async def get_user_by_id(id: int, service = Depends(Provide[Container.allocation_service])):
    logger.info("Getting entity succeeded")
    res = service.findAppUserById(id)
    return {"message": "Getting entity succeeded","result": res}

@welcome_router.get("/account/get_team/{id}")
@inject
async def get_team_by_id(id: int, service = Depends(Provide[Container.allocation_service])):
    res = service.findAppTeamById(id)
    return {"message": "Getting entity succeeded", "result":res}

@welcome_router.get("/account/get_allocation/{id}")
@inject
def get_allocation_by_id(id: int, service = Depends(Provide[Container.allocation_service])):
    res = service.findAllocationById(id)
    return {"message": "Getting entity succeeded", "result":res}

@welcome_router.get("/account/show_passcode_by_team_id/{id}")
@inject
async def show_passcode_by_team_id(id: int, service = Depends(Provide[Container.allocation_service])):
    res = service.exportPassCodeByTeamId(id)
    return {"message": "Passcode encoding succeeded", "result":res}