from src.repository.permission_allocation import PermissionAllocationRepository

def test_allocation_new_user_with_new_team(teamAllocationService, SessionLocal):
  # サービスが機能していることを確認
  user = teamAllocationService.findAppUserById(id=1)
  assert user == None
  
  alloc = teamAllocationService.createUserWithNewTeam(team_name="trinity", user_name="edgeMan", user_email="edgeMann@cmail.com")
  
  allocation = teamAllocationService.findAllocationById(id=alloc["id"])
  assert allocation['user']['name'] == 'edgeMan'
  
  passcode = teamAllocationService.exportPassCodeByTeamId(1)
  decoded = teamAllocationService.decodePassCode(passcode)
  assert decoded["team_name"] == "trinity"
  assert decoded["team_id"] == 1
  assert decoded["iat"] != None

def test_allocation_new_user_with_existing_team(teamAllocationService, SessionLocal):
  # サービスが機能していることを確認
  user = teamAllocationService.findAppUserById(id=1)
  assert user == None
  
  alloc = teamAllocationService.createUserWithNewTeam(team_name="trinity", user_name="edgeMan", user_email="edgeMann@cmail.com")
  
  allocation = teamAllocationService.findAllocationById(id=alloc["id"])
  assert allocation['user']['name'] == 'edgeMan'
  assert allocation['is_admin'] == True
  
  # チーム情報が格納されたパスコードを生成
  passcode = teamAllocationService.exportPassCodeByTeamId(1)
  decoded = teamAllocationService.decodePassCode(passcode)
  assert decoded["team_name"] == "trinity"
  assert decoded["team_id"] == 1
  assert decoded["iat"] != None
  
  # 既存のチームにユーザを追加
  alloc = teamAllocationService.createUserWithExistingTeamWithTeamId(team_id=1, user_name="judgeMann", user_email="judgeMann@cmail.com")
  allocation = teamAllocationService.findAllocationById(id=alloc["id"])
  assert allocation["team"]["name"] == "trinity"
  assert allocation["user"]["name"] == "judgeMann"
  assert allocation["user"]["email"] == "judgeMann@cmail.com"
  assert allocation["read_level"] == 0
  
  # パスコードを用いて、フォロワーユーザを取得できていることを確認
  alloc2 = teamAllocationService.createUserWithExistingTeamWithPassCode(passcode=passcode, user_name="aaaa", user_email="aaaa@vmail.com")
  
  # 不適当なパスコードを埋め込んで認証を要求した場合
  allocDummy = teamAllocationService.createUserWithExistingTeamWithPassCode(passcode="test", user_name="aaaa", user_email="aaaa@vmail.com")
  assert allocDummy != {}
  
  # チームが１つだけ登録されていることを確認
  teamCount = teamAllocationService.countTeams()
  assert teamCount == 1
  
  # ユーザが3人登録されていることを確認
  userCount = teamAllocationService.countUsers()
  assert userCount == 3
  
  # チームIDを条件にして、関連テーブルから登録情報を取得できることを確認
  list = teamAllocationService.findAllocationsByTeamId(1)
  
  assert len(list) == 3
  # 1つ目のオブジェクトの検証
  assert list[0]["user_id"] == 1
  assert list[0]["team_id"] == 1
  assert list[0]["read_level"] == 2
  assert list[0]["write_level"] == 2
  assert list[0]["is_admin"] == True
  assert list[0]["user"]["email"] == "edgeMann@cmail.com"
  assert list[0]["user"]["name"] == "edgeMan"
  assert list[0]["team"]["name"] == "trinity"
  # 2つ目のオブジェクトの検証
  assert list[1]["user_id"] == 2
  assert list[1]["team_id"] == 1
  assert list[1]["read_level"] == 0
  assert list[1]["write_level"] == 0
  assert list[1]["is_admin"] == False
  assert list[1]["user"]["email"] == "judgeMann@cmail.com"
  assert list[1]["user"]["name"] == "judgeMann"
  assert list[1]["team"]["name"] == "trinity"
  # 3つ目のオブジェクトの検証
  assert list[2]["user_id"] == 3
  assert list[2]["team_id"] == 1
  assert list[2]["read_level"] == 0
  assert list[2]["write_level"] == 0
  assert list[2]["is_admin"] == False
  assert list[2]["user"]["email"] == "aaaa@vmail.com"
  assert list[2]["user"]["name"] == "aaaa"
  assert list[2]["team"]["name"] == "trinity"
  
  # ユーザのメルアドから関連テーブルを持って来れることを確認
  allocations = teamAllocationService.findAllocationsByUserId(1)
  assert len(allocations) == 1
  assert allocations[0]["user_id"] == 1
  assert allocations[0]["team_id"] == 1
  assert allocations[0]["read_level"] == 2
  assert allocations[0]["write_level"] == 4
  assert allocations[0]["is_admin"] == True
  assert allocations[0]["user"]["email"] == "edgeMann@cmail.com"