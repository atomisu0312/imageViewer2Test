SET search_path = image;

CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dataowner VARCHAR(255) DEFAULT 'system',
    regist_date TIMESTAMP DEFAULT current_timestamp,
    enable_start_date TIMESTAMP DEFAULT '1970-01-01 00:00:00',
    enable_end_date TIMESTAMP DEFAULT '9999-12-31 23:59:59',
    version BIGINT DEFAULT 1
);

CREATE TABLE app_team (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dataowner VARCHAR(255) DEFAULT 'system',
    regist_date TIMESTAMP DEFAULT current_timestamp,
    enable_start_date TIMESTAMP DEFAULT '1970-01-01 00:00:00',
    enable_end_date TIMESTAMP DEFAULT '9999-12-31 23:59:59',
    version BIGINT DEFAULT 1
);

CREATE TABLE permission_allocation (
    user_id BIGINT NOT NULL, 
    team_id BIGINT NOT NULL, 
    read_level BIGINT NOT NULL, 
    write_level BIGINT NOT NULL, 
    is_admin BOOLEAN NOT NULL, 
    id BIGSERIAL, 
    dataowner VARCHAR(255) DEFAULT 'system',
    regist_date TIMESTAMP DEFAULT current_timestamp,
    enable_start_date TIMESTAMP DEFAULT '1970-01-01 00:00:00',
    enable_end_date TIMESTAMP DEFAULT '9999-12-31 23:59:59',
    version BIGINT DEFAULT 1,
    PRIMARY KEY (user_id, team_id, id), 
    FOREIGN KEY(user_id) REFERENCES app_user (id), 
    FOREIGN KEY(team_id) REFERENCES app_team (id)
);