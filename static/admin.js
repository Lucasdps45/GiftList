async function carregarPresentesAdmin() {
  const lista = document.getElementById('lista-admin');
  const resposta = await fetch('/admin/presentes');

  if (resposta.status === 401) {
    window.location.href = '/entrar';
    return;
  }

  const presentes = await resposta.json();

  if (presentes.length === 0) {
    lista.innerHTML = '<p class="empty">Nenhum presente cadastrado ainda.</p>';
    return;
  }

  lista.innerHTML = '';
  presentes.forEach((presente) => {
    lista.appendChild(criarItemAdmin(presente));
  });
}

function criarItemAdmin(presente) {
  const reservado = presente.reservado_por !== null;

  const item = document.createElement('li');
  item.className = 'admin-item';

  const quemBadge = reservado
    ? `<button class="who who--tomado btn-revelar" type="button">🔎 Ver quem reservou</button>`
    : `<span class="who who--livre">ainda não reservado</span>`;

  item.innerHTML = `
    <div class="admin-item__linha">
      <div>
        <div class="nome">${presente.nome}</div>
        <a class="link" href="${presente.link}" target="_blank" rel="noopener">${presente.link}</a>
      </div>
      <div class="admin-item__acoes">
        ${quemBadge}
        <button class="btn--ghost btn-editar" type="button">Editar</button>
        <button class="btn--ghost btn-deletar" type="button">Excluir</button>
      </div>
    </div>
    <form class="edit-form">
      <input type="text" class="edit-nome" value="${presente.nome}" maxlength="100" required />
      <input type="url" class="edit-link" value="${presente.link}" required />
      <div class="edit-form__botoes">
        <button class="btn btn--sage" type="submit">Salvar</button>
        <button class="btn--ghost btn-cancelar" type="button">Cancelar</button>
      </div>
    </form>
  `;

  const botaoRevelar = item.querySelector('.btn-revelar');
  if (botaoRevelar) {
    botaoRevelar.addEventListener('click', () => {
      botaoRevelar.textContent = presente.reservado_por;
      botaoRevelar.disabled = true;
    });
  }

  const botaoEditar = item.querySelector('.btn-editar');
  const botaoCancelar = item.querySelector('.btn-cancelar');
  const formEdicao = item.querySelector('.edit-form');
  const botaoDeletar = item.querySelector('.btn-deletar');

  botaoEditar.addEventListener('click', () => {
    formEdicao.classList.toggle('is-open');
  });

  botaoCancelar.addEventListener('click', () => {
    formEdicao.classList.remove('is-open');
  });

  formEdicao.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const nome = item.querySelector('.edit-nome').value;
    const link = item.querySelector('.edit-link').value;
    await editarPresente(presente.id, nome, link);
  });

  botaoDeletar.addEventListener('click', () => deletarPresente(presente.id, presente.nome));

  return item;
}

async function editarPresente(id, nome, link) {
  const resposta = await fetch(`/admin/presentes/${id}?nome=${encodeURIComponent(nome)}&link=${encodeURIComponent(link)}`, {
    method: 'PATCH',
  });

  if (resposta.ok) {
    await carregarPresentesAdmin();
  } else {
    alert('Não foi possível salvar as alterações.');
  }
}

async function deletarPresente(id, nome) {
  const confirmar = window.confirm(`Excluir "${nome}" da lista? Essa ação não pode ser desfeita.`);
  if (!confirmar) return;

  const resposta = await fetch(`/admin/presentes/${id}`, {
    method: 'DELETE',
  });

  if (resposta.ok) {
    await carregarPresentesAdmin();
  } else {
    alert('Não foi possível excluir o presente.');
  }
}

const form = document.getElementById('form-novo-presente');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const nome = document.getElementById('novo-nome').value;
  const link = document.getElementById('novo-link').value;

  const resposta = await fetch(`/admin/presentes?nome=${encodeURIComponent(nome)}&link=${encodeURIComponent(link)}`, {
    method: 'POST',
  });

  if (resposta.ok) {
    form.reset();
    await carregarPresentesAdmin();
  } else {
    alert('Não foi possível adicionar o presente.');
  }
});

carregarPresentesAdmin();