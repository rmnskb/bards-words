from fastapi.testclient import TestClient

from api.app import app

client = TestClient(app)


def test_index():
    response = client.get('/api/v1')
    assert response.status_code == 200
    assert response.json() == {'name': 'Shakespeare API'}


def test_health():
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'healthy'}

