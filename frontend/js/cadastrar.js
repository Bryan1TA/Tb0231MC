const API_URL = 'http://localhost:3000/produtos';
const STORAGE_KEY = 'produtos_moda_local';

const form = document.getElementById('form-produto');
const mensagem = document.getElementById('mensagem');

function lerProdutosLocal() {
  const bruto = localStorage.getItem(STORAGE_KEY);
  if (!bruto) return [];

  try {
    return JSON.parse(bruto);
  } catch (_erro) {
    return [];
  }
}

function salvarProdutosLocal(produtos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

function persistirProdutoLocal(produto) {
  const produtos = lerProdutosLocal();
  const atualizados = produtos.filter((item) => String(item.id) !== String(produto.id));
  atualizados.unshift(produto);
  salvarProdutosLocal(atualizados);
}

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

    const produtoSalvo = {
      id: dados.id || Date.now(),
      ...payload
    };
    persistirProdutoLocal(produtoSalvo);
    mensagem.textContent = 'Produto cadastrado com sucesso!';
    form.reset();
  } catch (erro) {
    try {
      validarPayload(payload);
      const novoProduto = {
        id: Date.now(),
        ...payload
      };
      persistirProdutoLocal(novoProduto);
      mensagem.textContent = 'API offline: produto salvo no modo local.';
      form.reset();
    } catch (erroLocal) {
      mensagem.textContent = erroLocal.message || erro.message;
    }
  }
});
