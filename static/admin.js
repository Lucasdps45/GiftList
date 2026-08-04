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
    const item = document.createElement('li');
    const reservado = presente.reservado_por !== null;

    item.innerHTML = `
      <div>
        <div class="nome">${presente.nome}</div>
        <a class="link" href="${presente.link}" target="_blank" rel="noopener">${presente.link}</a>
      </div>
      <span class="who ${reservado ? 'who--tomado' : 'who--livre'}">
        ${reservado ? presente.reservado_por : 'disponível'}
      </span>
    `;
    lista.appendChild(item);
  });
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