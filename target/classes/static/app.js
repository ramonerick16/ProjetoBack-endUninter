const api = '';
const hoje = new Date().toISOString().slice(0,10);
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clienteDesde').value = hoje;
  carregarTudo();
});

async function request(url, options={}){
  const resp = await fetch(api + url, {headers:{'Content-Type':'application/json'}, ...options});
  if(!resp.ok){
    const txt = await resp.text();
    throw new Error(txt || `Erro HTTP ${resp.status}`);
  }
  if(resp.status === 204) return null;
  return resp.json();
}

async function carregarTudo(){ await Promise.all([listarClientes(), listarProdutos(), listarPedidos()]); }

async function listarClientes(){
  const dados = await request('/clientes');
  const tbody = document.getElementById('clientesTabela');
  tbody.innerHTML = dados.map(c => `<tr><td>${c.id}</td><td>${c.nome}</td><td>${c.clienteDesde || ''}</td><td><button class="edit" onclick='editarCliente(${JSON.stringify(c)})'>Editar</button><button class="danger" onclick="excluirCliente(${c.id})">Excluir</button></td></tr>`).join('');
}
async function listarProdutos(){
  const dados = await request('/produtos');
  const tbody = document.getElementById('produtosTabela');
  tbody.innerHTML = dados.map(p => `<tr><td>${p.id}</td><td>${p.nome}</td><td>R$ ${Number(p.preco).toFixed(2)}</td><td>${p.estoque ? 'Sim' : 'Não'}</td><td><button class="edit" onclick='editarProduto(${JSON.stringify(p)})'>Editar</button><button class="danger" onclick="excluirProduto(${p.id})">Excluir</button></td></tr>`).join('');
}
async function listarPedidos(){
  const dados = await request('/pedidos');
  const tbody = document.getElementById('pedidosTabela');
  tbody.innerHTML = dados.map(p => `<tr><td>${p.id}</td><td>${p.clienteId}</td><td>${p.produtoId}</td><td>${p.quantidade}</td><td><button class="edit" onclick='editarPedido(${JSON.stringify(p)})'>Editar</button><button class="danger" onclick="excluirPedido(${p.id})">Excluir</button></td></tr>`).join('');
}

document.getElementById('clienteForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('clienteId').value;
  const body = { nome: document.getElementById('clienteNome').value, clienteDesde: document.getElementById('clienteDesde').value };
  await request(id ? `/clientes/${id}` : '/clientes', {method: id ? 'PUT':'POST', body: JSON.stringify(body)});
  limparCliente(); await listarClientes();
});
document.getElementById('produtoForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('produtoId').value;
  const body = { nome: document.getElementById('produtoNome').value, preco: Number(document.getElementById('produtoPreco').value), estoque: document.getElementById('produtoEstoque').checked };
  await request(id ? `/produtos/${id}` : '/produtos', {method: id ? 'PUT':'POST', body: JSON.stringify(body)});
  limparProduto(); await listarProdutos();
});
document.getElementById('pedidoForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('pedidoId').value;
  const body = { clienteId: Number(document.getElementById('pedidoClienteId').value), produtoId: Number(document.getElementById('pedidoProdutoId').value), quantidade: Number(document.getElementById('pedidoQuantidade').value) };
  try{ await request(id ? `/pedidos/${id}` : '/pedidos', {method: id ? 'PUT':'POST', body: JSON.stringify(body)}); limparPedido(); await listarPedidos(); }
  catch(err){ alert('Erro ao salvar pedido: ' + err.message); }
});

function editarCliente(c){ document.getElementById('clienteId').value=c.id; document.getElementById('clienteNome').value=c.nome; document.getElementById('clienteDesde').value=c.clienteDesde || hoje; window.scrollTo({top:0,behavior:'smooth'}); }
function editarProduto(p){ document.getElementById('produtoId').value=p.id; document.getElementById('produtoNome').value=p.nome; document.getElementById('produtoPreco').value=p.preco; document.getElementById('produtoEstoque').checked=p.estoque; window.scrollTo({top:0,behavior:'smooth'}); }
function editarPedido(p){ document.getElementById('pedidoId').value=p.id; document.getElementById('pedidoClienteId').value=p.clienteId; document.getElementById('pedidoProdutoId').value=p.produtoId; document.getElementById('pedidoQuantidade').value=p.quantidade; window.scrollTo({top:0,behavior:'smooth'}); }
function limparCliente(){ document.getElementById('clienteId').value=''; document.getElementById('clienteNome').value='Erick Ramon Alves da Silveira e Silva5021939'; document.getElementById('clienteDesde').value=hoje; }
function limparProduto(){ document.getElementById('produtoId').value=''; document.getElementById('produtoNome').value='Baozi Tradicional de Carne Suína'; document.getElementById('produtoPreco').value='12.90'; document.getElementById('produtoEstoque').checked=true; }
function limparPedido(){ document.getElementById('pedidoId').value=''; document.getElementById('pedidoClienteId').value='1'; document.getElementById('pedidoProdutoId').value='1'; document.getElementById('pedidoQuantidade').value='6'; }
async function excluirCliente(id){ if(confirm('Excluir cliente?')){ await request(`/clientes/${id}`,{method:'DELETE'}); await carregarTudo(); } }
async function excluirProduto(id){ if(confirm('Excluir produto?')){ await request(`/produtos/${id}`,{method:'DELETE'}); await carregarTudo(); } }
async function excluirPedido(id){ if(confirm('Excluir pedido?')){ await request(`/pedidos/${id}`,{method:'DELETE'}); await listarPedidos(); } }
