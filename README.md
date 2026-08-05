# 🎁 GiftList | Chá de Casa Nova

Aplicação web full-stack para gerenciar uma lista de presentes de chá de casa nova. Convidados escolhem presentes de forma anônima entre si, e o organizador tem um painel próprio para cadastrar itens e acompanhar quem reservou o quê.

---

## 📸 Screenshots

![Página pública](assets/pagina-publica.png)
![Painel admin](assets/admin.png)
![Mensagem de reserva](assets/reserva.png)
---

## ✨ Funcionalidades

- **Lista pública de presentes** : qualquer visitante vê os itens disponíveis, sem precisar de login
- **Reserva anônima entre convidados** : ao escolher um presente, o convidado informa o nome; a partir daí, o item aparece como indisponível para os demais, sem revelar quem reservou
- **Painel administrativo protegido** : login por senha, com sessão via cookie
- **CRUD completo de presentes** : criar, editar e excluir itens da lista
- **Reserva oculta por padrão no admin** : o nome de quem reservou só aparece ao clicar em "ver quem reservou" 
- **Interface própria, responsiva** : layout com identidade visual construída para o tema, sem uso de templates prontos

## 🛠️ Stack

**Backend**
- Python + [FastAPI](https://fastapi.tiangolo.com/)
- SQLAlchemy 2.0 (ORM)
- PostgreSQL (hospedado no [Neon](https://neon.tech))
- Autenticação simples via cookie de sessão

**Frontend**
- Jinja2 (server-side templates)
- HTML, CSS e JavaScript puro (sem frameworks ou build tools)

**Deploy**
- [Render](https://render.com) (aplicação)
- [Neon](https://neon.tech) (banco de dados)

## 📁 Estrutura do projeto

```
GiftList/
├── app.py              # rotas da aplicação (páginas + API)
├── database.py         # conexão com o banco e sessão do SQLAlchemy
├── models.py            # modelo Gift (tabela 'presentes')
├── schemas.py           # schemas Pydantic (validação/serialização)
├── auth.py               # autenticação por senha + tokens de sessão
├── templates/
│   ├── index.html        # página pública
│   ├── login.html        # login do admin
│   └── admin.html        # painel administrativo
├── static/
│   ├── style.css
│   ├── app.js            # lógica da página pública
│   ├── login.js
│   └── admin.js           # lógica do painel admin
└── requirements.txt
```

## 🚀 Rodando localmente

```bash
git clone https://github.com/Lucasdps45/GiftList.git
cd GiftList

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Crie um arquivo `.env` na raiz com:

```
DATABASE_URL=postgresql+psycopg2://usuario:senha@host:porta/nome_do_banco
ADMIN_PASSWORD=sua_senha_aqui
```

Depois:

```bash
uvicorn app:app --reload
```

Acesse `http://127.0.0.1:8000`.

## 🔌 Principais rotas da API

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| GET | `/presentes` | Lista presentes (sem revelar quem reservou) | Público |
| POST | `/presentes/{id}/reservar` | Reserva um presente | Público |
| POST | `/login` | Autentica o admin | Público |
| GET | `/admin/presentes` | Lista completa, incluindo `reservado_por` | Admin |
| POST | `/admin/presentes` | Cadastra um presente | Admin |
| PATCH | `/admin/presentes/{id}` | Edita um presente | Admin |
| DELETE | `/admin/presentes/{id}` | Remove um presente | Admin |

## 💡 Possíveis melhorias futuras

- Opção do convidado desfazer a própria reserva
- Migrations com Alembic
- Testes automatizados

## 👤 Autor

**Lucas** — Estudante de Engenharia de Computação
[GitHub](https://github.com/Lucasdps45) |
[Linkedin](https://www.linkedin.com/in/lucas-de-p-santos/)
