from pydantic import BaseModel, ConfigDict
from typing import Optional
from dataclasses import dataclass

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
