from dependency_injector import containers, providers

from src.repository.app_user import AppUserRepository
from src.repository.app_team import AppTeamRepository
from src.repository.permission_allocation import PermissionAllocationRepository
from src.service.team_allocation import TeamAllocationService
from src.config.database import Database

class TestClassA:
  def __init__(self):
    self.a = "a"
    
class Container(containers.DeclarativeContainer):
  wiring_config = containers.WiringConfiguration(["src.endpoints.welcome"])
  config = providers.Configuration()
  
  db = providers.Singleton(Database)
  
  user_repository = providers.Factory(
    AppUserRepository
  )
  
  app_team_repository = providers.Factory(
    AppTeamRepository
  )
  permission_allocation_repository = providers.Factory(
    PermissionAllocationRepository
  )
  allocation_service = providers.Factory(
    TeamAllocationService, session_factory=db.provided.session, 
      app_user_repository=user_repository, app_team_repository = app_team_repository, 
      permission_allocation_repository=permission_allocation_repository
  )
  
  test = providers.Factory(TestClassA)
  
  