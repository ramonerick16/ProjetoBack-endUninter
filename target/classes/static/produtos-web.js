document.addEventListener('DOMContentLoaded',listar);
async function req(url,opt={}){const r=await fetch(url,{headers:{'Content-Type':'application/json'},...opt}); if(!r.ok) throw new Error(await r.text()); return r.status===204?null:r.json();}
async function listar(){const dados=await req('/produtos'); document.getElementById('tabela').innerHTML=dados.map(p=>`<tr><td>${p.id}</td><td>${p.nome}</td><td>R$ ${Number(p.preco).toFixed(2)}</td><td>${p.estoque?'Sim':'Não'}</td><td><button class="edit" onclick='editar(${JSON.stringify(p)})'>Editar</button> <button class="danger" onclick="excluir(${p.id})">Excluir</button></td></tr>`).join('');}
document.getElementById('formProduto').addEventListener('submit',async e=>{e.preventDefault(); const id=produtoId.value; const body={nome:nome.value,preco:Number(preco.value),estoque:estoque.checked}; await req(id?`/produtos/${id}`:'/produtos',{method:id?'PUT':'POST',body:JSON.stringify(body)}); limparFormulario(); listar();});
function editar(p){produtoId.value=p.id; nome.value=p.nome; preco.value=p.preco; estoque.checked=p.estoque; scrollTo({top:0,behavior:'smooth'});}
function limparFormulario(){produtoId.value=''; nome.value='Baozi Tradicional de Carne Suína'; preco.value='12.90'; estoque.checked=true;}
async function excluir(id){if(confirm('Excluir produto?')){await req(`/produtos/${id}`,{method:'DELETE'}); listar();}}
