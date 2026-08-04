const form = document.getElementById('login-form');
const erro = document.getElementById('login-erro');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const senha = document.getElementById('senha').value;
  erro.textContent = '';

  const resposta = await fetch(`/login?senha=${encodeURIComponent(senha)}`, {
    method: 'POST',
  });

  if (resposta.ok) {
    window.location.href = '/admin';
  } else {
    erro.textContent = 'Senha incorreta, tenta de novo.';
  }
});