from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Query
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import logging, io, csv, jwt, bcrypt

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=12), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

PyObjectId = Annotated[str, BeforeValidator(str)]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Models ----------
class LoginInput(BaseModel):
    email: EmailStr
    password: str

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    type: str = "general"  # free_trial, corporate, institutional, general
    subject: Optional[str] = None
    message: Optional[str] = None
    source_page: Optional[str] = None

class EnquiryUpdate(BaseModel):
    status: str  # new, contacted, converted, closed

class WorkshopInput(BaseModel):
    title: str
    category: str = "corporate"  # corporate, combat, law_enforcement, krav_maga
    date: str
    location: str
    description: str
    published: bool = True

class GalleryInput(BaseModel):
    title: str
    media_type: str = "image"  # image, video
    url: str
    category: Optional[str] = "training"

class ContentBlockInput(BaseModel):
    key: str
    value: str

class TestimonialInput(BaseModel):
    name: str
    role: Optional[str] = None
    quote: str
    published: bool = True

# ---------- Helpers ----------
def serialize(doc: dict) -> dict:
    if not doc:
        return doc
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    doc.pop("password_hash", None)
    return doc

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return serialize(user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------- Auth ----------
@api_router.post("/auth/login")
async def login(payload: LoginInput, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user["_id"]), email)
    response.set_cookie(key="access_token", value=token, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    return {"user": serialize(user), "token": token}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out"}

@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

# ---------- Enquiries ----------
@api_router.post("/enquiries")
async def create_enquiry(payload: EnquiryCreate):
    doc = payload.model_dump()
    doc.update({"status": "new", "created_at": now_iso()})
    res = await db.enquiries.insert_one(doc)
    doc["_id"] = res.inserted_id
    logger.info(f"New enquiry: {doc['type']} from {doc['email']}")
    return serialize(doc)

@api_router.get("/enquiries")
async def list_enquiries(status: Optional[str] = None, user: dict = Depends(get_current_user)):
    q = {"status": status} if status else {}
    docs = await db.enquiries.find(q).sort("created_at", -1).to_list(1000)
    return [serialize(d) for d in docs]

@api_router.patch("/enquiries/{eid}")
async def update_enquiry(eid: str, payload: EnquiryUpdate, user: dict = Depends(get_current_user)):
    res = await db.enquiries.update_one({"_id": ObjectId(eid)}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    doc = await db.enquiries.find_one({"_id": ObjectId(eid)})
    return serialize(doc)

@api_router.delete("/enquiries/{eid}")
async def delete_enquiry(eid: str, user: dict = Depends(get_current_user)):
    await db.enquiries.delete_one({"_id": ObjectId(eid)})
    return {"message": "Deleted"}

@api_router.get("/enquiries/export/csv")
async def export_enquiries(user: dict = Depends(get_current_user)):
    docs = await db.enquiries.find({}).sort("created_at", -1).to_list(5000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Phone", "Type", "Subject", "Message", "Status", "Source", "Created At"])
    for d in docs:
        writer.writerow([d.get("name",""), d.get("email",""), d.get("phone",""), d.get("type",""),
                         d.get("subject",""), d.get("message",""), d.get("status",""), d.get("source_page",""), d.get("created_at","")])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=enquiries.csv"})

# ---------- Workshops ----------
@api_router.get("/workshops")
async def list_workshops(all: bool = False):
    q = {} if all else {"published": True}
    docs = await db.workshops.find(q).sort("date", 1).to_list(1000)
    return [serialize(d) for d in docs]

@api_router.post("/workshops")
async def create_workshop(payload: WorkshopInput, user: dict = Depends(get_current_user)):
    doc = payload.model_dump()
    doc["created_at"] = now_iso()
    res = await db.workshops.insert_one(doc)
    doc["_id"] = res.inserted_id
    return serialize(doc)

@api_router.put("/workshops/{wid}")
async def update_workshop(wid: str, payload: WorkshopInput, user: dict = Depends(get_current_user)):
    await db.workshops.update_one({"_id": ObjectId(wid)}, {"$set": payload.model_dump()})
    doc = await db.workshops.find_one({"_id": ObjectId(wid)})
    if not doc:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return serialize(doc)

@api_router.delete("/workshops/{wid}")
async def delete_workshop(wid: str, user: dict = Depends(get_current_user)):
    await db.workshops.delete_one({"_id": ObjectId(wid)})
    return {"message": "Deleted"}

# ---------- Gallery ----------
@api_router.get("/gallery")
async def list_gallery():
    docs = await db.gallery.find({}).sort("created_at", -1).to_list(1000)
    return [serialize(d) for d in docs]

@api_router.post("/gallery")
async def create_gallery(payload: GalleryInput, user: dict = Depends(get_current_user)):
    doc = payload.model_dump()
    doc["created_at"] = now_iso()
    res = await db.gallery.insert_one(doc)
    doc["_id"] = res.inserted_id
    return serialize(doc)

@api_router.delete("/gallery/{gid}")
async def delete_gallery(gid: str, user: dict = Depends(get_current_user)):
    await db.gallery.delete_one({"_id": ObjectId(gid)})
    return {"message": "Deleted"}

# ---------- Content Blocks ----------
@api_router.get("/content")
async def get_content():
    docs = await db.content_blocks.find({}).to_list(1000)
    return {d["key"]: d["value"] for d in docs}

@api_router.put("/content")
async def update_content(payload: ContentBlockInput, user: dict = Depends(get_current_user)):
    await db.content_blocks.update_one({"key": payload.key}, {"$set": {"value": payload.value}}, upsert=True)
    return {"key": payload.key, "value": payload.value}

# ---------- Testimonials ----------
@api_router.get("/testimonials")
async def list_testimonials(all: bool = False):
    q = {} if all else {"published": True}
    docs = await db.testimonials.find(q).sort("created_at", -1).to_list(1000)
    return [serialize(d) for d in docs]

@api_router.post("/testimonials")
async def create_testimonial(payload: TestimonialInput, user: dict = Depends(get_current_user)):
    doc = payload.model_dump()
    doc["created_at"] = now_iso()
    res = await db.testimonials.insert_one(doc)
    doc["_id"] = res.inserted_id
    return serialize(doc)

@api_router.put("/testimonials/{tid}")
async def update_testimonial(tid: str, payload: TestimonialInput, user: dict = Depends(get_current_user)):
    await db.testimonials.update_one({"_id": ObjectId(tid)}, {"$set": payload.model_dump()})
    doc = await db.testimonials.find_one({"_id": ObjectId(tid)})
    if not doc:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return serialize(doc)

@api_router.delete("/testimonials/{tid}")
async def delete_testimonial(tid: str, user: dict = Depends(get_current_user)):
    await db.testimonials.delete_one({"_id": ObjectId(tid)})
    return {"message": "Deleted"}

@api_router.get("/")
async def root():
    return {"message": "360 Degree Secure API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DEFAULT_CONTENT = {
    "hero_title": "Nothing is Impossible to a Willing Mind",
    "hero_subtitle": "Elite safety, self-defense, Krav Maga & law enforcement training for a world that demands readiness.",
    "about_mission": "We exist to make real-world safety accessible. 360 Degree Secure trains individuals, corporates, and forces to protect themselves and others through practical, tested, no-nonsense methods.",
    "founder_bio": "Anjan Gogoi is a certified Krav Maga and tactical defense instructor with years of field-tested experience training civilians, corporates, and law enforcement personnel across India.",
}

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": "Admin", "role": "admin", "created_at": now_iso()})
        logger.info("Admin seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
    for k, v in DEFAULT_CONTENT.items():
        await db.content_blocks.update_one({"key": k}, {"$setOnInsert": {"value": v}}, upsert=True)
    if await db.workshops.count_documents({}) == 0:
        seed_ws = [
            {"title": "Women's Self-Defense Intensive", "category": "combat", "date": "2026-07-12", "location": "Guwahati, Assam", "description": "A high-intensity one-day workshop teaching practical escapes, strikes, and situational awareness.", "published": True, "created_at": now_iso()},
            {"title": "Corporate Travel Safety Program", "category": "corporate", "date": "2026-07-20", "location": "Online + On-site", "description": "Equip your travelling workforce with executive protection awareness and threat mitigation.", "published": True, "created_at": now_iso()},
            {"title": "Krav Maga Foundations Batch", "category": "krav_maga", "date": "2026-08-01", "location": "360 Degree Secure Dojo", "description": "6-week beginner Krav Maga program covering fundamentals of the world's most practical combat system.", "published": True, "created_at": now_iso()},
        ]
        await db.workshops.insert_many(seed_ws)
    # remove any placeholder gallery docs (e.g. test data with bad urls)
    await db.gallery.delete_many({"url": {"$regex": "^http://x"}})
    if await db.gallery.count_documents({}) == 0:
        seed_gallery = [
            {"title": "Live Demonstration", "media_type": "image", "url": "/founder-demo.jpg", "category": "Demo", "created_at": now_iso()},
            {"title": "Knife Defense Drill", "media_type": "image", "url": "/train3.jpg", "category": "Combat", "created_at": now_iso()},
            {"title": "Briefing the Squad", "media_type": "image", "url": "/train4.jpg", "category": "Founder", "created_at": now_iso()},
            {"title": "Firearm Disarm", "media_type": "image", "url": "/train1.jpg", "category": "Law Enforcement", "created_at": now_iso()},
            {"title": "Ground Control", "media_type": "image", "url": "/train2.jpg", "category": "Combat", "created_at": now_iso()},
            {"title": "Weapon Threat Response", "media_type": "image", "url": "/train5.jpg", "category": "Tactical", "created_at": now_iso()},
        ]
        await db.gallery.insert_many(seed_gallery)
    if await db.testimonials.count_documents({}) == 0:
        seed_testimonials = [
            {"name": "Priya Sharma", "role": "Student, Guwahati", "quote": "I walked in nervous and walked out confident. The trial class alone changed how I carry myself every single day.", "published": True, "created_at": now_iso()},
            {"name": "Inspector R. Das", "role": "Assam Police", "quote": "The UAC training was practical, intense and exactly what our personnel needed. No theatrics — just real capability.", "published": True, "created_at": now_iso()},
            {"name": "Rahul Medhi", "role": "Corporate HR Lead", "quote": "Our team's travel-safety workshop was eye-opening. Professional, engaging and genuinely useful for everyone.", "published": True, "created_at": now_iso()},
        ]
        await db.testimonials.insert_many(seed_testimonials)

@app.on_event("shutdown")
async def shutdown():
    client.close()
