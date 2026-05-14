from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import List, Literal
from uuid import uuid4

class CandidateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=10, max_length=10)
    skills: List[str] = Field(..., min_length=1)
    experience_years: int = Field(..., ge=0)
    status: Literal["active", "inactive"]

    @field_validator('name', 'phone', mode='before')
    @classmethod
    def validate_not_empty_string(cls, v):
        if isinstance(v, str) and not v.strip():
            raise ValueError('field cannot be empty')
        return v.strip() if isinstance(v, str) else v

    @field_validator('phone', mode='before')
    @classmethod
    def validate_phone(cls, v):
        if not isinstance(v, str):
            raise ValueError('phone must be a string')
        digits = ''.join(ch for ch in v if ch.isdigit())
        if len(digits) != 10:
            raise ValueError('phone must be exactly 10 digits')
        return digits

    @field_validator('skills', mode='before')
    @classmethod
    def validate_skills(cls, v):
        if not isinstance(v, list):
            raise ValueError('skills must be a list')
        cleaned_skills = []
        for skill in v:
            if not isinstance(skill, str):
                continue
            trimmed = skill.strip()
            if trimmed and trimmed not in cleaned_skills:
                cleaned_skills.append(trimmed)
        if not cleaned_skills:
            raise ValueError('at least one skill is required')
        return cleaned_skills

class Candidate(CandidateBase):
    id: str

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
candidates: List[Candidate] = []
@app.get("/")
def home():
    return {"message": "Candidate API is running"}

@app.get("/candidates", response_model=List[Candidate])
def get_candidates():
    return candidates

@app.post("/candidates", response_model=Candidate)
def create_candidate(candidate_data: CandidateBase):
    candidate = Candidate(id=str(uuid4()), **candidate_data.dict())
    candidates.append(candidate)
    return candidate

@app.get("/candidates/{candidate_id}", response_model=Candidate)
def get_candidate(candidate_id: str):
    for candidate in candidates:
        if candidate.id == candidate_id:
            return candidate
    raise HTTPException(status_code=404, detail="Candidate not found")