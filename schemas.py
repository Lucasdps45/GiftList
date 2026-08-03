from pydantic import BaseModel

class PresenteResponse(BaseModel):
    nome: str
    link: str
    status: str