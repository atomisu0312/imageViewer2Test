FROM python:3.11.9-slim-bullseye

WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
ARG PG_DB_HOST_PORT
ARG PG_DB_USER
ARG PG_DB_PASSWORD
ARG PG_DB_NAME
ARG AUTH_INTERLEAVE_DIM
ARG AUTH_JWT_SECRET
ARG AUTH_JWT_SALT

ENV PG_DB_HOST_PORT=$PG_DB_HOST_PORT
ENV PG_DB_USER=$PG_DB_USER
ENV PG_DB_PASSWORD=$PG_DB_PASSWORD
ENV PG_DB_NAME=$PG_DB_NAME
ENV AUTH_INTERLEAVE_DIM=$AUTH_INTERLEAVE_DIM
ENV AUTH_JWT_SECRET=$AUTH_JWT_SECRET
ENV AUTH_JWT_SALT=$AUTH_JWT_SALT

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./src /code/src
EXPOSE 8080

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]