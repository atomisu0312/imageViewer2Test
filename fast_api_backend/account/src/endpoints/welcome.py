from fastapi import APIRouter, Depends, Response, status  
from dependency_injector.wiring import inject, Provide
from src.config.container import Container, TestClassA

from src.service.team_allocation import TeamAllocationService

from src.endpoints.schema.welcome_schema import NewTeamAndUserRequest, NewFollowingUserRequest

from fastapi import Depends, Body

#ロガーを定義する
import logging
logger = logging.getLogger(__name__)
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

