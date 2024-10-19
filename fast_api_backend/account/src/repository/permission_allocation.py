from sqlalchemy.orm import Session, joinedload
from src.repository.app_team import AppTeamRepository
from src.repository.app_user import AppUserRepository
from src.entity.team_allocation import models
from src.schema.team_allocation import schemas
app_team_repo = AppTeamRepository()
app_user_repo = AppUserRepository()

class PermissionAllocationRepository:
  
  def findPermissionAllocationByPermissionId(self, db: Session, id: int):
    return db.query(models.PermissionAllocation).options(joinedload(models.PermissionAllocation.user)).options(joinedload(models.PermissionAllocation.team)).filter(models.PermissionAllocation.id == id).first()
  
  def findAllcationListWithTeamId(self, db: Session, team_id: int):
    return db.query(models.PermissionAllocation).options(joinedload(models.PermissionAllocation.user)).options(joinedload(models.PermissionAllocation.team)).filter(models.PermissionAllocation.team_id == team_id).all()
  
  def findAllcationListWithUserId(self, db: Session, user_id: int):
    return db.query(models.PermissionAllocation).options(joinedload(models.PermissionAllocation.user)).options(joinedload(models.PermissionAllocation.team)).filter(models.PermissionAllocation.user_id == user_id).all()
  
  def findAllocationWithTeamIdAndUserEmail(self, db: Session, team_id: int, email: str):
    return db.query(models.PermissionAllocation).options(
                    joinedload(models.PermissionAllocation.user)).options(
                      joinedload(models.PermissionAllocation.team)).filter(
                        models.PermissionAllocation.team_id == team_id).filter(
                          models.PermissionAllocation.user.has(email=email)).first()
  
  def insertAllocationWithNewTeamAndNewUser(self, db: Session, allocation: schemas.PermissionAllocationForCreate):
    allocation_object: dict = allocation.to_dict()
    user = allocation_object["user"]
    db_user = app_user_repo.insertAppUser(db = db, user =schemas.UserBase(email=user["email"], name=user["name"]))
    team = allocation_object["team"]
    db_team = app_team_repo.insertAppTeam(db = db, team = schemas.TeamBase(name=team["name"]))
    
    read_level = allocation_object["read_level"]
    write_level = allocation_object["write_level"]
    is_admin = allocation_object["is_admin"]
    
    db_allocation = models.PermissionAllocation(team_id=db_team.id, user_id=db_user.id, read_level=read_level, write_level=write_level, is_admin=is_admin)
    
    db.add(db_allocation)
    return db_allocation

  def insertAllocationWithExistingTeamAndNewUser(self,  db: Session, allocation: schemas.PermissionAllocationForCreate):
    allocation_object = allocation.to_dict()
    team_id = allocation_object["team_id"]
    user = allocation_object["user"]
    db_user = app_user_repo.insertAppUser(db = db, user =schemas.UserBase(email=user["email"], name=user["name"]))
    
    read_level = allocation_object["read_level"]
    write_level = allocation_object["write_level"]
    
    db_allocation = models.PermissionAllocation(team_id=team_id, user_id=db_user.id, read_level=read_level, write_level=write_level)
    
    db.add(db_allocation)
    return db_allocation