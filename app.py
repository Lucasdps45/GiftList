import os
from database import Base, SessionLocal, engine
from models import Gift
from fastapi import FastAPI, Response, HTTPException, Depends
from auth import gerar_token
from schemas import PresenteResponse
from auth import verificar_admin


Base.metadata.create_all(engine)

app = FastAPI()

@app.post('/login')
def login(senha: str, response : Response):
    if senha != os.getenv('ADMIN_PASSWORD'):
        raise HTTPException(status_code = 401, detail= 'Senha incorreta')

    token = gerar_token()
    response.set_cookie(key='session_token', value=token, httponly=True)
    return{'status': 'logado'}

@app.get('/presentes')
def listar_presentes():
    with SessionLocal() as session:
        presentes = session.query(Gift).all()

        resultado = []

        for presente in presentes:
            status = "🎁 Disponível" if presente.reservado_por is None else "✅ Já foi escolhido"  

            resultado.append(PresenteResponse(
                nome=presente.nome,
                link=presente.link,
                status=status
            ))

        return resultado

@app.post('/admin/presentes')
def criar_presente(nome : str, link : str, autorizado: bool = Depends(verificar_admin)):
    with SessionLocal() as session:
        novo_presente = Gift(nome=nome, link=link)
        session.add(novo_presente)
        session.commit()
        nome_criado = novo_presente.nome

    return f'{nome_criado} adicionado com sucesso'

@app.post('/presentes/{id}/reservar')
def reservar_presente(id : int, convidado : str):
    with SessionLocal() as session:
        presente = session.get(Gift, id)
        if presente is None:
            raise HTTPException(status_code=404, detail='Item não encontrado')
        if presente.reservado_por is not None:
            raise HTTPException(status_code=409, detail='Item já reservado') 
        presente.reservado_por = convidado
        session.commit()
        nome_presente = presente.nome

    return f'Vc escolheu {nome_presente}, obrigado!'
