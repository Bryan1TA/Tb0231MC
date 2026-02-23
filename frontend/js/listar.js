const API_URL = 'http://localhost:3000/produtos';
const STORAGE_KEY = 'produtos_moda_local';

const lista = document.getElementById('lista-produtos');
const mensagem = document.getElementById('mensagem');

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function cardProduto(produto) {
  const imagem = produto.imagem_url ||
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80';

  return `
    <article class="card" data-id="${produto.id}">
      <img src="${imagem}" alt="${produto.nome}" />
      <div class="card__body">
        <h4>${produto.nome}</h4>
        <p class="meta">${produto.categoria} | ${produto.marca}</p>
        <p>${produto.descricao || 'Sem descricao.'}</p>
        <p class="price">${formatarMoeda(produto.preco)}</p>
        <div class="card__actions">
          <button class="btn btn-delete" data-id="${produto.id}" type="button">Apagar</button>
        </div>
      </div>
    </article>
  `;
}

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

function renderizarProdutos(produtos) {
  if (produtos.length === 0) {
    lista.innerHTML = '';
    mensagem.textContent = 'Nenhum produto cadastrado ainda.';
    return;
  }

  mensagem.textContent = '';
  lista.innerHTML = produtos.map(cardProduto).join('');
}

async function buscarProdutosApi() {
  const resposta = await fetch(API_URL);
  if (!resposta.ok) {
    throw new Error('Falha ao buscar produtos.');
  }
  return resposta.json();
}

async function apagarProduto(id) {
  try {
    mensagem.textContent = 'Apagando produto...';
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (!resposta.ok) {
      const dados = await resposta.json();
      throw new Error(dados.erro || 'Falha ao apagar produto.');
    }

    mensagem.textContent = 'Produto apagado com sucesso.';
    await carregarProdutos();
  } catch (_erro) {
    const produtos = lerProdutosLocal();
    const atualizados = produtos.filter((produto) => String(produto.id) !== String(id));
    salvarProdutosLocal(atualizados);
    renderizarProdutos(atualizados);
    mensagem.textContent = 'API offline: produto apagado no modo local.';
  }
}

async function carregarProdutos() {
  try {
    mensagem.textContent = 'Carregando produtos...';
    const produtos = await buscarProdutosApi();
    salvarProdutosLocal(produtos);
    renderizarProdutos(produtos);
  } catch (_erro) {
    const produtosLocal = lerProdutosLocal();
    renderizarProdutos(produtosLocal);
    if (produtosLocal.length > 0) {
      mensagem.textContent = 'API offline: exibindo produtos locais.';
    } else {
      mensagem.textContent = 'API offline e sem dados locais.';
    }
  }
}

lista.addEventListener('click', (event) => {
  const alvo = event.target;
  if (!(alvo instanceof HTMLElement)) return;
  if (!alvo.classList.contains('btn-delete')) return;

  const id = alvo.getAttribute('data-id');
  if (!id) return;

  apagarProduto(id);
});

carregarProdutos();
