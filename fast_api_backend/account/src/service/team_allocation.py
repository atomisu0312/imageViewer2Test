from typing import Any, Callable
from sqlalchemy.orm import Session

from src.entity.team_allocation.models import PermissionAllocation
from src.schema.team_allocation.schemas import PermissionAllocationForCreate, TeamBase, UserBase
from src.service.common.abstract_service import AbstractService
from src.repository.app_user import AppUserRepository
from src.repository.app_team import AppTeamRepository
from src.repository.permission_allocation import PermissionAllocationRepository
from src.lib.jwt import encode_app_jwt, decode_app_jwt
from src.lib.array_util import interleaveString, untiInterleaveString

import os
AUTH_INTERLEAVE_DIM = int(os.getenv("AUTH_INTERLEAVE_DIM", 7))

class TeamAllocationService(AbstractService):
  def __init__(self, session_factory:Callable[[], Session],
                app_user_repository: AppUserRepository, app_team_repository: AppTeamRepository,
                  permission_allocation_repository: PermissionAllocationRepository):
    super().__init__(session_factory)
    self.app_user_repository = app_user_repository
    self.app_team_repository = app_team_repository
    self.permission_allocation_repository = permission_allocation_repository
  
  """
  PermissionAllocationのエンティティをマップに変換する
  """
  def entity_to_dict(self, entity:PermissionAllocation)-> dict[str, Any]:
    obj = {}
    if entity is None:
      return obj
    
    obj = entity.__dict__
    obj['user'] = entity.user.__dict__
    obj['team'] = entity.team.__dict__
    return obj
  
  """
  ユーザ数を取得する
  """
  @AbstractService.with_session_readonly
  def countUsers(self, session):
    return self.app_user_repository.count(session)
  
  """
  チームの数を取得する
  """
  @AbstractService.with_session_readonly
  def countTeams(self, session):
    return self.app_team_repository.count(session)
  
  """
  ユーザをID指定で取得する
  """
  @AbstractService.with_session_readonly
  def findAppUserById(self, session, id: int):
    res = self.app_user_repository.findAppUserById(session, id)
    return res.__dict__ if res else None
  
  """
  チームをID指定で取得する
  """
  @AbstractService.with_session_readonly
  def findAppTeamById(self, session, id: int):
    res = self.app_team_repository.findAppTeamById(session, id)
    return res.__dict__ if res else None
  
  """
  登録情報をチームIDとユーザのメールアドレスをキーにして取得する
  """
  @AbstractService.with_session_readonly
  def findAllocationByTeamIdAndUserEmail(self, session, team_id: int, email: str):
    res = self.permission_allocation_repository.findAllocationWithTeamIdAndUserEmail(session, team_id, email)
    return self.entity_to_dict(res)
  
  """
  登録情報をID指定で取得する
  """
  @AbstractService.with_session_readonly
  def findAllocationById(self, session, id: int):
    res = self.permission_allocation_repository.findPermissionAllocationByPermissionId(session, id)
    return self.entity_to_dict(res)
  
  """
  登録情報のリストをチームIDで取得する
  """
  @AbstractService.with_session_readonly
  def findAllocationsByTeamId(self, session, team_id: int):
    res = self.permission_allocation_repository.findAllcationListWithTeamId(session, team_id)
    return [self.entity_to_dict(x) for x in res] if res else None
  
  """
  登録情報のリストをユーザIDで取得する
  """
  @AbstractService.with_session_readonly
  def findAllocationsByUserId(self, session, user_id: int):
    res = self.permission_allocation_repository.findAllcationListWithUserId(session, user_id)
    return [self.entity_to_dict(x) for x in res] if res else None
  
  """
  新規ユーザとはじめのチームを作成する
  """
  @AbstractService.with_session
  def createUserWithNewTeam(self, session, team_name: str, user_name: str, user_email: str):
    sample_team = TeamBase(name=team_name)
    sample_user = UserBase(name=user_name, email=user_email)
    dto = PermissionAllocationForCreate(team = sample_team, user=sample_user, read_level=2, write_level=2, is_admin=True)
    
    res =  self.permission_allocation_repository.insertAllocationWithNewTeamAndNewUser(session, dto)
    return res.__dict__ if res else None
  
  """
  すでに存在しているチームに紐づくユーザを作成する
  @param team_id チームID
  @param user_name ユーザ名
  @param user_email ユーザのメールアドレス
  """
  @AbstractService.with_session
  def createUserWithExistingTeamWithTeamId(self, session, team_id:int, user_name:str, user_email:str):
    user = UserBase(name=user_name, email=user_email)
    dto = PermissionAllocationForCreate(team_id = team_id, user=user)
    res = self.permission_allocation_repository.insertAllocationWithExistingTeamAndNewUser(session, dto)
    return res.__dict__ if res else None
  
  """
  すでに存在しているチームに紐づくユーザを作成する
  コチラについてはパスコードを利用して、ユーザを作成する
  なお、パスコードが無効である場合には
  @param passcode パスコード
  @param user_name ユーザ名
  @param user_email ユーザのメールアドレス
  """
  @AbstractService.with_session
  def createUserWithExistingTeamWithPassCode(self, session, passcode:str, user_name:str, user_email:str):
    decoded = {}
    try:
      decoded = decode_app_jwt(untiInterleaveString(passcode, AUTH_INTERLEAVE_DIM))
    except Exception as e:
      print(f"Error during decryption: {e}")
      return {"message": "decryption error", "status":"failed"}
    
    team_id = decoded["team_id"]
    team = self.app_team_repository.findAppTeamById(session, team_id)
    
    if team is None:
      return {"message": "team not found", "status":"failed"}
    if decoded["team_name"] != team.name:
      return {"message": "team name mismatch", "status":"failed"}
    
    user = UserBase(name=user_name, email=user_email)
    dto = PermissionAllocationForCreate(team_id = team_id, user=user)
    res = self.permission_allocation_repository.insertAllocationWithExistingTeamAndNewUser(session, dto)
    result = res.__dict__["status"] = "success" if res else "failed"
    return result if res else {"message": "error", "status":"failed"}
  
  """
  ID指定でパスコードを出力する
  @param team_id チームID
  """
  def exportPassCodeByTeamId(self, team_id: int):
    team = self.findAppTeamById(id = team_id)
    if team is None:
      return None
    team_name = team["name"]
    team_id = team["id"]
    
    obj = {
      "team_name": team_name,
      "team_id": team_id
    }
    
    return interleaveString(encode_app_jwt(obj), AUTH_INTERLEAVE_DIM)
  
  """
  パスコードをデコードしてオブジェクトを取り出す
  """
  def decodePassCode(self, code: str) -> dict[str, Any]:
    return decode_app_jwt(untiInterleaveString(code, AUTH_INTERLEAVE_DIM))