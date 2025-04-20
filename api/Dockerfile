FROM python:3.11-slim

# Create and activate venv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /api

COPY . /api/
RUN pip install --no-cache-dir --upgrade -r /api/requirements.api.txt

EXPOSE 80

# DEV mode
CMD [ "fastapi", "run", "app.py", "--port", "80" ]
