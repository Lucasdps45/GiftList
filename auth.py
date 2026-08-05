import secrets

from fastapi import Cookie, HTTPException, status

admin_tokens = set()

def gerar_token():
    token = secrets.token_hex(16)
    admin_tokens.add(token)
    return token

def verificar_admin(session_token: str = Cookie(default=None)):
    if session_token is None or session_token not in admin_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Não autorizado'
        )
    return True 