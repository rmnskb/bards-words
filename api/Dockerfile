FROM python:3.11-slim

WORKDIR /api

COPY ./requirements.api.txt /api/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /api/requirements.txt

COPY . /api/

EXPOSE 80

# DEV mode
CMD [ "fastapi", "run", "app.py", "--port", "80"]
