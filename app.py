import os
from typing import Optional

from fastapi import Cookie, Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from auth import admin_tokens, gerar_token, verificar_admin
from database import Base, SessionLocal, engine
from models import Gift
from schemas import PresenteAdminResponse, PresenteResponse

Base.metadata.create_all(engine)

app = FastAPI()
app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')

@app.get('/')
def home(request: Request):
    return templates.TemplateResponse(request, 'index.html')

@app.get('/entrar')
def pagina_login(request: Request):
    return templates.TemplateResponse(request, 'login.html')

@app.get('/admin')
def pagina_admin(request: Request, session_token: str = Cookie(default=None)):
    if session_token not in admin_tokens:
        return RedirectResponse('/entrar')
    return templates.TemplateResponse(request, 'admin.html')

@app.post('/login')
def login(senha: str, response: Response):
    if senha != os.getenv('ADMIN_PASSWORD'):
        raise HTTPException(status_code=401, detail='Senha incorreta')

    token = gerar_token()
    response.set_cookie(key='session_token', value=token, httponly=True)
    return {'status': 'logado'}

@app.get('/presentes')
def listar_presentes():
    with SessionLocal() as session:
        presentes = session.query(Gift).all()

        resultado = []

        for presente in presentes:
            status = "🎁 Disponível" if presente.reservado_por is None else "✅ Já foi escolhido"

            resultado.append(PresenteResponse(
                id=presente.id,
                nome=presente.nome,
                link=presente.link,
                status=status
            ))

        return resultado

@app.post('/presentes/{id}/reservar')
def reservar_presente(id: int, convidado: str):
    with SessionLocal() as session:
        presente = session.get(Gift, id)
        if presente is None:
            raise HTTPException(status_code=404, detail='Item não encontrado')
        if presente.reservado_por is not None:
            raise HTTPException(status_code=409, detail='Item já reservado')

        presente.reservado_por = convidado
        session.commit()
        nome_presente = presente.nome

    return f'Você escolheu {nome_presente}, obrigado!'

@app.get('/admin/presentes')
def listar_presentes_admin(autorizado: bool = Depends(verificar_admin)):
    with SessionLocal() as session:
        presentes = session.query(Gift).all()

        resultado = []

        for presente in presentes:
            resultado.append(PresenteAdminResponse(
                id=presente.id,
                nome=presente.nome,
                link=presente.link,
                reservado_por=presente.reservado_por
            ))
        return resultado

@app.post('/admin/presentes')
def criar_presente(nome: str, link: str, autorizado: bool = Depends(verificar_admin)):
    with SessionLocal() as session:
        novo_presente = Gift(nome=nome, link=link)
        session.add(novo_presente)
        session.commit()
        nome_criado = novo_presente.nome

    return f'{nome_criado} adicionado com sucesso'

@app.delete('/admin/presentes/{id}')
def deletar_presentes(id : int, autorizado: bool = Depends(verificar_admin)):
    with SessionLocal() as session:
        presente = session.get(Gift, id)
        if presente is None:
            raise HTTPException(status_code=404, detail='Item não encontrado')

        session.delete(presente)
        session.commit()
        presente_deletado = presente.nome

    return f'O {presente_deletado} foi deletado da lista.'

@app.patch('/admin/presentes/{id}')
def editar_presentes(id : int, nome: Optional[str], link: Optional[str], autorizado: bool = Depends(verificar_admin)):
    with SessionLocal() as session:
        presente = session.get(Gift, id)
        if presente is None:
            raise HTTPException(status_code=404, detail='Item não encontrado')

        if nome is not None:
            presente.nome = nome

        if link is not None:
            presente.link = link

        session.commit()
        presente_atualizado = presente.nome

    return f'O {presente_atualizado} foi atualizado com sucesso.'