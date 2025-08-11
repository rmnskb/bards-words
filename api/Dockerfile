FROM python:3.13-slim

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create and activate venv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /api

COPY . /api/
RUN pip install --no-cache-dir --upgrade -r /api/requirements.api.txt

EXPOSE 80

# DEV mode
CMD [ "fastapi", "run", "app.py", "--port", "80", "--reload" ]
