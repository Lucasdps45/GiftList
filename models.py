from database import Base
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text

class Gift(Base):
    __tablename__ = 'presentes'

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(100))
    link: Mapped[str] = mapped_column(Text)
    reservado_por: Mapped[Optional[str]] = mapped_column(String(50))