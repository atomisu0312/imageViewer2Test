# fastapi-sample

Describe your project here.

rye run pytest tests

rye run pytest --log-cli-level=INFO tests

rye run uvicorn --port 8001 --reload src.main:app

sed '/^-e*/d' requirements-dev.lock > requirements.txt