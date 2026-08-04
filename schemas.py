from pydantic import BaseModel
from typing import Optional

class PresenteResponse(BaseModel):
    nome: str
    link: str
    status: str


class PresenteAdminResponse(BaseModel):
    id : int
    nome: str
    link: str
    reservado_por: Optional[str]