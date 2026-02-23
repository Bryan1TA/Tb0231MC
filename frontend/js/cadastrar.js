const API_URL = '/produtos';

const form = document.getElementById('form-produto');
const mensagem = document.getElementById('mensagem');

function validarPayload(payload) {
  if (!payload.nome || !payload.categoria || !payload.marca || Number.isNaN(payload.preco)) {
    throw new Error('Preencha nome, categoria, marca e preco corretamente.');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    nome: document.getElementById('nome').value.trim(),
    categoria: document.getElementById('categoria').value.trim(),
    marca: document.getElementById('marca').value.trim(),
    preco: Number(document.getElementById('preco').value),
    descricao: document.getElementById('descricao').value.trim(),
    imagem_url: document.getElementById('imagem_url').value.trim()
  };

  try {
    validarPayload(payload);
    mensagem.textContent = 'Salvando...';

    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || 'Falha no cadastro.');
    }

    mensagem.textContent = 'Produto cadastrado com sucesso no MySQL!';
    form.reset();
  } catch (erro) {
    mensagem.textContent = erro.message || 'Erro ao cadastrar produto.';
    console.error(erro);
  }
});
