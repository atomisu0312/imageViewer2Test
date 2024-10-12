from pydantic import BaseModel, ConfigDict
from typing import Optional
from dataclasses import dataclass

#  json={"email":"hoge@gmail.com", "team_name":"team1", "user_name": "hogeSann"})
@dataclass
class NewTeamAndUserRequest:
  email: str
  team_name: str
  user_name: str
  
@dataclass  
class NewFollowingUserRequest:
  email: str
  pass_code: str
  user_name: str
  
