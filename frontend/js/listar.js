const API_URL = '/produtos';

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

function renderizarProdutos(produtos) {
  if (produtos.length === 0) {
    lista.innerHTML = '';
    mensagem.textContent = 'Nenhum produto cadastrado ainda.';
    return;
  }

  mensagem.textContent = '';
  lista.innerHTML = produtos.map(cardProduto).join('');
}

async function apagarProduto(id) {
  try {
    mensagem.textContent = 'Apagando produto...';
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || 'Falha ao apagar produto.');
    }

    mensagem.textContent = 'Produto apagado com sucesso.';
    await carregarProdutos();
  } catch (erro) {
    mensagem.textContent = erro.message || 'Erro ao apagar produto.';
    console.error(erro);
  }
}

async function carregarProdutos() {
  try {
    mensagem.textContent = 'Carregando produtos...';
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error('Falha ao buscar produtos no MySQL.');
    }

    const produtos = await resposta.json();
    renderizarProdutos(produtos);
  } catch (erro) {
    mensagem.textContent = erro.message || 'Erro ao carregar produtos.';
    lista.innerHTML = '';
    console.error(erro);
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
