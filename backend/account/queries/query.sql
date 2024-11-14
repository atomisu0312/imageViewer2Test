-- name: FindUserById :one
-- FindUserById ...
SELECT * 
FROM app_user 
WHERE id = $1;