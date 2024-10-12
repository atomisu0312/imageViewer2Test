from starlette.testclient import TestClient
from src.repository.app_team import AppTeamRepository
from src.schema.team_allocation.schemas import PermissionAllocationBase, PermissionAllocationForCreate,TeamBase,  TeamCreate, UserBase
from src.repository.permission_allocation import PermissionAllocationRepository
from src.main import app
from tests.config.database import temp_db_container

client = TestClient(app)

# リポジトリのユニットテスト
def test_db_unit_allocation_new_team(SessionLocal, teamAllocationService):
  sample_team = TeamBase(name="judgeMonster")
  sample_user = UserBase(name="test", email="test@example.com")
  sample_user2 = UserBase(name="test_follow", email="follow@example.com")
  
  sample_allocation = PermissionAllocationForCreate(team = sample_team, user=sample_user, read_level=2, write_level=2)
  sample_allocation2 = PermissionAllocationForCreate(team_id = 1, user=sample_user2)
  
  with SessionLocal() as db:
    try:
      permRepo :PermissionAllocationRepository = PermissionAllocationRepository()
      teamRepo = AppTeamRepository()
      permRepo.insertAllocationWithNewTeamAndNewUser(db=db, allocation=sample_allocation)
      db.commit()

      allocation = permRepo.findPermissionAllocationByPermissionId(db = db, id = 1)
      team = teamRepo.findAppTeamById(db = db, id = 1)
      assert team.name == "judgeMonster"

      assert allocation.read_level == 2
      assert allocation.write_level == 2
      assert allocation.team_id == 1
      assert allocation.user_id == 1
      assert allocation.user.name == "test"
      assert allocation.user.email == "test@example.com"
      assert allocation.team.name == "judgeMonster"

      # 今度はフォロワーを追加
      permRepo.insertAllocationWithExistingTeamAndNewUser(db=db, allocation=sample_allocation2)
      db.commit()
      allocation_list = permRepo.findAllcationListWithTeamId(db, 1)
      assert len(allocation_list) == 2
    finally:
      db.close()
    
  # ユーザの存在を確認
  user = teamAllocationService.findAppUserById(id=1)
  assert user['name'] == "test"
  assert user['id'] == 1
  
  # フォロワーの存在も確認
  user2 = teamAllocationService.findAppUserById(id=2)
  assert user2['name'] == "test_follow"
  assert user2['id'] == 2
  assert user2['email'] == "follow@example.com"