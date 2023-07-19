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

    if (tabName === "Listar") {
        listarProdutos();
    }
}

function adicionarProduto() {
    var nome = document.getElementById("nome").value;
    var codigo = document.getElementById("codigo").value;
    var preco = document.getElementById("preco").value;

    if (nome && codigo && preco) {
        var resultado = window.pywebview.api.adicionar_produto(nome, codigo, preco);
        resultado.then(function (response) {
            if (response === true) {
                alert("Produto adicionado com sucesso!");

                document.getElementById("nome").value = "";
                document.getElementById("codigo").value = "";
                document.getElementById("preco").value = "";

            } else {
                alert("Erro ao adicionar produto. Motivo: " + response);
            }
        });
    } else {
        alert("Preencha todos os campos!");
    }
}

function removerProduto() {
    var codigo = document.getElementById("removerCodigo").value;

    if (codigo) {
        var resultado = window.pywebview.api.remover_produto(codigo);
        resultado.then(function (response) {
            if (response) {
                alert("Produto removido com sucesso!");
            } else {
                alert("Erro ao remover produto.");
            }
        });
    } else {
        alert("Informe o código do produto!");
    }
}

function iniciarVenda() {
    var codigo = document.getElementById("vendaCodigo").value;
    var quantidade = document.getElementById("quantidade").value;

    if (codigo && quantidade) {
        var resultado = window.pywebview.api.iniciar_venda(codigo, quantidade);
        resultado.then(function (response) {
            if (response) {
                atualizarCarrinho();
            } else {
                alert("Erro ao adicionar ao carrinho.");
            }
        });
    } else {
        alert("Preencha todos os campos!");
    }
}

function atualizarCarrinho() {
    var venda = window.pywebview.api.get_venda_atual();
    venda.then(function (items) {
        var carrinhoDiv = document.getElementById("carrinho");
        var total = 0;

        carrinhoDiv.innerHTML = "";
        items.forEach(item => {
            var li = document.createElement("li");
            li.textContent = item.nome + " (" + item.quantidade + ") - $" + item.preco;
            carrinhoDiv.appendChild(li);
            total += item.preco * item.quantidade;
        });

        document.getElementById("totalVenda").textContent = "$" + total.toFixed(2);
    });
}

function finalizarVenda() {
    var resultado = window.pywebview.api.finalizar_venda();
    resultado.then(function (response) {
        alert("Venda finalizada. Total: $" + response.toFixed(2));
        atualizarCarrinho();
    });
}

function listarProdutos() {
    var resultado = window.pywebview.api.listar_produtos();
    resultado.then(function (produtos) {
        var container = document.getElementById("produtos");
        container.innerHTML = "";

        produtos.forEach(function (produto) {
            container.innerHTML += produto.nome + " (" + produto.codigo + "): $" + produto.preco + "<br>";
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementsByClassName('tablinks')[0].click();
});
