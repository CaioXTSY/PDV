function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  if (tabName == 'Listar') {
      listarProdutos();
  }
  if (tabName == 'Vender') {
      mostrarCarrinho();
  }
}

document.getElementById('Adicionar').style.display = 'block';

async function adicionarProduto() {
  const nome = document.getElementById('nome').value;
  const codigo = document.getElementById('codigo').value;
  const preco = document.getElementById('preco').value;

  const resultado = await pywebview.api.adicionar_produto(nome, codigo, preco);

  if (resultado) {
      alert('Produto adicionado com sucesso!');
      listarProdutos();
  } else {
      alert('Falha ao adicionar o produto.');
  }

  document.getElementById('nome').value = '';
  document.getElementById('codigo').value = '';
  document.getElementById('preco').value = '';
}

async function removerProduto() {
  const codigo = document.getElementById('removerCodigo').value;

  const resultado = await pywebview.api.remover_produto(codigo);

  if (resultado) {
      alert('Produto removido com sucesso!');
      listarProdutos();
  } else {
      alert('Falha ao remover o produto.');
  }

  document.getElementById('removerCodigo').value = '';
}

async function listarProdutos() {
  const produtos = await pywebview.api.listar_produtos();

  let html = '';
  for (let produto of produtos) {
      html += `<p>${produto.nome} - ${produto.codigo} - ${produto.preco}</p>`;
  }

  document.getElementById('produtos').innerHTML = html;
}

async function iniciarVenda() {
  const codigo = document.getElementById('vendaCodigo').value;
  const quantidade = document.getElementById('quantidade').value;

  const resultado = await pywebview.api.iniciar_venda(codigo, quantidade);

  if (resultado) {
      mostrarCarrinho();
  } else {
      alert('Falha ao iniciar venda.');
  }

  document.getElementById('vendaCodigo').value = '';
  document.getElementById('quantidade').value = '';
}

function mostrarCarrinho() {
}
