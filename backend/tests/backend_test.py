"""Backend API tests for 360 Degree Secure."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://safety-authority.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@360degreesecure.com"
ADMIN_PASSWORD = "Tactical@360"


@pytest.fixture
def anon():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    # Fallback: use bearer as well in case cookie doesn't propagate
    token = data.get("token")
    if token:
        s.headers.update({"Authorization": f"Bearer {token}"})
    return s


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, anon):
        r = anon.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["user"]["email"] == ADMIN_EMAIL
        assert "token" in d

    def test_login_wrong_password(self, anon):
        r = anon.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_unauth(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_auth(self, admin):
        r = admin.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---------- Workshops ----------
class TestWorkshops:
    def test_public_list_published(self, anon):
        r = anon.get(f"{BASE_URL}/api/workshops")
        assert r.status_code == 200
        docs = r.json()
        assert isinstance(docs, list)
        assert len(docs) >= 1
        for d in docs:
            assert d["published"] is True
            assert "_id" not in d
            assert "id" in d

    def test_all_requires_no_auth_but_returns_all(self, anon):
        r = anon.get(f"{BASE_URL}/api/workshops?all=true")
        assert r.status_code == 200

    def test_create_requires_auth(self, anon):
        r = anon.post(f"{BASE_URL}/api/workshops", json={"title": "X", "category": "corporate", "date": "2026-09-01", "location": "L", "description": "D"})
        assert r.status_code == 401

    def test_crud_flow(self, admin):
        payload = {"title": "TEST_Workshop", "category": "corporate", "date": "2026-09-15", "location": "Test Loc", "description": "Test Desc", "published": False}
        r = admin.post(f"{BASE_URL}/api/workshops", json=payload)
        assert r.status_code == 200
        wid = r.json()["id"]
        assert r.json()["title"] == "TEST_Workshop"

        # publish toggle via PUT
        payload["published"] = True
        r = admin.put(f"{BASE_URL}/api/workshops/{wid}", json=payload)
        assert r.status_code == 200
        assert r.json()["published"] is True

        # appears in public list
        r = requests.get(f"{BASE_URL}/api/workshops")
        assert any(w["id"] == wid for w in r.json())

        # delete
        r = admin.delete(f"{BASE_URL}/api/workshops/{wid}")
        assert r.status_code == 200
        r = requests.get(f"{BASE_URL}/api/workshops?all=true")
        assert not any(w["id"] == wid for w in r.json())


# ---------- Enquiries ----------
class TestEnquiries:
    _created_ids = []

    @pytest.mark.parametrize("etype", ["free_trial", "corporate", "institutional", "general"])
    def test_public_create(self, anon, etype):
        payload = {
            "name": f"TEST_{etype}",
            "email": f"test_{etype}@example.com",
            "phone": "9999999999",
            "type": etype,
            "subject": f"Sub {etype}",
            "message": "Test msg",
            "source_page": "test",
        }
        r = anon.post(f"{BASE_URL}/api/enquiries", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["status"] == "new"
        assert d["type"] == etype
        assert "id" in d
        TestEnquiries._created_ids.append(d["id"])

    def test_list_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/enquiries")
        assert r.status_code == 401

    def test_list_authed(self, admin):
        r = admin.get(f"{BASE_URL}/api/enquiries")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_patch_status_and_delete(self, admin):
        assert TestEnquiries._created_ids, "Need created enquiry"
        eid = TestEnquiries._created_ids[0]
        r = admin.patch(f"{BASE_URL}/api/enquiries/{eid}", json={"status": "contacted"})
        assert r.status_code == 200
        assert r.json()["status"] == "contacted"

        # delete remaining test enquiries
        for eid in TestEnquiries._created_ids:
            admin.delete(f"{BASE_URL}/api/enquiries/{eid}")

    def test_csv_export(self, admin):
        r = admin.get(f"{BASE_URL}/api/enquiries/export/csv")
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        assert "attachment" in r.headers.get("content-disposition", "").lower()


# ---------- Gallery ----------
class TestGallery:
    def test_public_list(self, anon):
        r = anon.get(f"{BASE_URL}/api/gallery")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_requires_auth(self, anon):
        r = anon.post(f"{BASE_URL}/api/gallery", json={"title": "x", "url": "http://x", "media_type": "image"})
        assert r.status_code == 401

    def test_create_and_delete(self, admin):
        r = admin.post(f"{BASE_URL}/api/gallery", json={"title": "TEST_G", "url": "https://picsum.photos/200", "media_type": "image"})
        assert r.status_code == 200
        gid = r.json()["id"]
        r = admin.delete(f"{BASE_URL}/api/gallery/{gid}")
        assert r.status_code == 200


# ---------- Content ----------
class TestContent:
    def test_get_defaults(self, anon):
        r = anon.get(f"{BASE_URL}/api/content")
        assert r.status_code == 200
        d = r.json()
        assert "hero_title" in d

    def test_put_requires_auth(self, anon):
        r = anon.put(f"{BASE_URL}/api/content", json={"key": "x", "value": "y"})
        assert r.status_code == 401

    def test_upsert(self, admin):
        r = admin.put(f"{BASE_URL}/api/content", json={"key": "test_key", "value": "test_val"})
        assert r.status_code == 200
        r = requests.get(f"{BASE_URL}/api/content")
        assert r.json().get("test_key") == "test_val"
