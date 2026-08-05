async function carregarPresentes() {
  const grid = document.getElementById('grid');
  const resposta = await fetch('/presentes');
  const presentes = await resposta.json();

  if (presentes.length === 0) {
    grid.innerHTML = '<p class="empty">Ainda não tem presente na lista. Volta aqui depois! 🎁</p>';
    return;
  }

  grid.innerHTML = '';
  presentes.forEach((presente) => {
    grid.appendChild(criarTag(presente));
  });
}

function criarTag(presente) {
  const reservado = presente.status.includes('escolhido');

  const tag = document.createElement('article');
  tag.className = 'tag';

  const statusClasse = reservado ? 'tag__status--reservado' : 'tag__status--disponivel';

  tag.innerHTML = `
    <span class="tag__status ${statusClasse}">${presente.status}</span>
    <h2 class="tag__nome" title="${presente.nome}">${truncar(presente.nome)}</h2>
    <a class="tag__link" href="${presente.link}" target="_blank" rel="noopener">Ver o presente ↗</a>
    <div class="tag__acao"></div>
  `;

  const acao = tag.querySelector('.tag__acao');

  if (!reservado) {
    const botao = document.createElement('button');
    botao.className = 'btn btn--rose';
    botao.textContent = 'Escolher esse';

    const form = document.createElement('div');
    form.className = 'reserve-form';
    form.innerHTML = `
      <input type="text" placeholder="Seu nome" maxlength="50" />
      <button class="btn btn--sage">Confirmar</button>
    `;

    botao.addEventListener('click', () => {
      form.classList.toggle('is-open');
    });

    const input = form.querySelector('input');
    const confirmar = form.querySelector('button');

    confirmar.addEventListener('click', () => reservarPresente(presente.id ?? presente.nome, input.value, tag));

    input.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter') reservarPresente(presente.id ?? presente.nome, input.value, tag);
    });

    acao.appendChild(botao);
    acao.appendChild(form);
  }

  return tag;
}

function truncar(texto, limite = 45) {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite).trim() + '…';
}

async function reservarPresente(id, nome, tagElement) {
  if (!nome || nome.trim() === '') return;

  const resposta = await fetch(`/presentes/${id}/reservar?convidado=${encodeURIComponent(nome.trim())}`, {
    method: 'POST',
  });

  if (resposta.ok) {
    const mensagem = await resposta.text();
    mostrarToast(mensagem.replace(/"/g, ''));
    await carregarPresentes();
  } else {
    const erro = await resposta.json();
    alert(erro.detail || 'Não foi possível reservar esse presente.');
    await carregarPresentes();
  }
}

function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  toast.textContent = `${mensagem} 🎀`;
  toast.classList.add('is-visible');

  clearTimeout(mostrarToast._timer);
  mostrarToast._timer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}

carregarPresentes();