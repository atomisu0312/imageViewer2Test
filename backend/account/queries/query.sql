-- name: FindUserById :one
-- FindUserById ...
SELECT * 
FROM app_user 
WHERE id = $1;

-- name: InsertUser :one
-- InsertUser ...
INSERT INTO app_user (name, email)
VALUES ($1, $2)
RETURNING *;

-- name: GetAllocationByUserIdAndTeamId :one
-- GetAllocationByUserIdAndTeamId ...
SELECT *
FROM permission_allocation
INNER JOIN app_user ON permission_allocation.user_id = app_user.id
INNER JOIN app_team ON permission_allocation.team_id = app_team.id
WHERE user_id = $1
AND team_id = $2;

-- name: GetAllocationJoinedById :one
-- GetAllocationJoinedById ...
SELECT *
FROM permission_allocation
INNER JOIN app_user ON permission_allocation.user_id = app_user.id
INNER JOIN app_team ON permission_allocation.team_id = app_team.id
WHERE permission_allocation.id = $1;

-- name: GetAllocationOnlyById :one
-- GetAllocationOnlyById ...
SELECT *
FROM permission_allocation
WHERE permission_allocation.id = $1;

