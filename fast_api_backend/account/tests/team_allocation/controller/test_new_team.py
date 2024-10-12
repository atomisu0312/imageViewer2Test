from tests.config.database import temp_db_container
from starlette.testclient import TestClient

from src.main import app

client = TestClient(app)

@temp_db_container
def test_create_user2():
  response = client.post("/welcome/new_team_and_user")
  assert response.status_code != 200
  
  # ユーザとチーム作成エンドポイントを叩く
  response = client.post("/welcome/new_team_and_user", json={"email":"hoge@gmail.com", "team_name":"team1", "user_name": "hogeSann"})
  assert response.status_code == 200
  
  response = client.get("/account/get_user/1")
  # レスポンスのJSONコンテンツを取得
  response_content = response.json()
  
  # テストアサーション
  assert response.status_code == 200
  assert response_content != {"result": None}  # 期待される結果に応じて修正
  
  # パスコードを出力できることの確認
  response = client.get("/account/show_passcode_by_team_id/1")
  response_content = response.json()
  passcode = response_content["result"]
  assert response_content["result"] != ""
  
  # フォロワーが挿入できることを確認
  response = client.post("/welcome/new_following_user", json={"email":"testZEX@gmail.com", "pass_code": passcode, "user_name": "testZEX"})
  response_content = response.json()
  assert response_content != {}
  
  response = client.get("/account/get_user/2")
  # レスポンスのJSONコンテンツを取得
  response_content = response.json()
  assert response_content['result']['name'] == "testZEX"
  
  # フォロワーが挿入できることを確認（異常系）
  response = client.post("/welcome/new_following_user", json={"email":"testZEX@gmail.com", "pass_code": "ybntiu", "user_name": "testZEX"})
  response_content = response.json()
  assert response_content != {}
  
  # フォロワーの存在を確認
  response = client.get("/account/get_user/3")
  response_content = response.json()
  passcode = response_content["result"]
  assert response_content["result"] == None