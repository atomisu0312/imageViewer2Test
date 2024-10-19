from dataclasses import dataclass

@dataclass
class AllcoationByTeamIdAndUserEmailRequest:
  team_id: str
  email: str