echo "### initialize start ####"
set PGCLIENTENCODING=utf-8
chcp 65001
set PGPASSWORD=postgres
#psql dropdb -U postgres image_viewer
psql -U postgres --command="DROP TABLE IF EXISTS image_viewer"
psql -U postgres --command="DROP TABLE IF EXISTS test_image_viewer"
#psql dropuser -U postgres image_viewer
psql -U postgres --command="DROP USER IF EXISTS image_viewer"
#psql createuser -d -U postgres image_viewer
psql -U postgres --command="CREATE USER image_viewer"
psql -U postgres --command="ALTER ROLE image_viewer WITH PASSWORD 'password00'"
psql -U postgres --command="ALTER USER image_viewer set search_path to image"
#psql createdb -U postgres image_viewer
psql -U postgres --command="CREATE DATABASE image_viewer LC_COLLATE 'ja_JP.UTF-8' LC_CTYPE 'ja_JP.UTF-8' ENCODING 'UTF8' TEMPLATE template0"
psql -U postgres --command="ALTER DATABASE image_viewer OWNER TO image_viewer"
psql -U postgres --command="GRANT ALL PRIVILEGES ON DATABASE image_viewer TO image_viewer"
psql -U postgres --command="ALTER ROLE image_viewer CREATEDB"

psql -U postgres --command="CREATE DATABASE test_image_viewer LC_COLLATE 'ja_JP.UTF-8' LC_CTYPE 'ja_JP.UTF-8' ENCODING 'UTF8' TEMPLATE template0"
psql -U postgres --command="ALTER DATABASE test_image_viewer OWNER TO image_viewer"
psql -U postgres --command="GRANT ALL PRIVILEGES ON DATABASE test_image_viewer TO image_viewer"

set PGDATABASE=image_viewer
set PGPASSWORD=password00
psql -U image_viewer -d image_viewer --command="CREATE SCHEMA image"
set PGUSER=image_viewer
psql -U image_viewer -d test_image_viewer --command="CREATE SCHEMA image"

psql -U image_viewer -d image_viewer -f /docker-entrypoint-initdb.d/sql/02-user.sql