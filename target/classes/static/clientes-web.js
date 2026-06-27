const hoje = new Date().toISOString().slice(0,10);
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('clienteDesde').value=hoje; listar();});
async function req(url,opt={}){const r=await fetch(url,{headers:{'Content-Type':'application/json'},...opt}); if(!r.ok) throw new Error(await r.text()); return r.status===204?null:r.json();}
async function listar(){const dados=await req('/clientes'); document.getElementById('tabela').innerHTML=dados.map(c=>`<tr><td>${c.id}</td><td>${c.nome}</td><td>${c.clienteDesde||''}</td><td><button class="edit" onclick='editar(${JSON.stringify(c)})'>Editar</button> <button class="danger" onclick="excluir(${c.id})">Excluir</button></td></tr>`).join('');}
document.getElementById('formCliente').addEventListener('submit',async e=>{e.preventDefault(); const id=clienteId.value; const body={nome:nome.value,clienteDesde:clienteDesde.value}; await req(id?`/clientes/${id}`:'/clientes',{method:id?'PUT':'POST',body:JSON.stringify(body)}); limparFormulario(); listar();});
function editar(c){clienteId.value=c.id; nome.value=c.nome; clienteDesde.value=c.clienteDesde||hoje; scrollTo({top:0,behavior:'smooth'});}
function limparFormulario(){clienteId.value=''; nome.value='Erick Ramon Alves da Silveira e Silva5021939'; clienteDesde.value=hoje;}
async function excluir(id){if(confirm('Excluir cliente?')){await req(`/clientes/${id}`,{method:'DELETE'}); listar();}}
