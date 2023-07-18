import webview
from threading import Thread
import json

class Produto:
    def __init__(self, nome, codigo, preco):
        self.nome = nome
        self.codigo = codigo
        self.preco = preco

class PDV:
    def __init__(self):
        self.produtos = {}
        self.venda_atual = []

    def adicionar_produto(self, nome, codigo, preco):
        if float(preco) <= 0:
            return False
        else:
            self.produtos[codigo] = Produto(nome, codigo, preco)
            return True

    def remover_produto(self, codigo):
        if codigo in self.produtos:
            del self.produtos[codigo]
            return True
        else:
            return False

    def listar_produtos(self):
        return [{"nome": produto.nome, "codigo": produto.codigo, "preco": produto.preco} for produto in self.produtos.values()]

    def iniciar_venda(self, codigo, quantidade):
        quantidade = int(quantidade)
        if codigo in self.produtos and quantidade > 0:
            self.venda_atual.append((self.produtos[codigo], quantidade))
            return True
        else:
            return False

    def finalizar_venda(self):
        total = sum(produto.preco * quantidade for produto, quantidade in self.venda_atual)
        self.venda_atual = []
        return total

pdv = PDV()

def load_html(window):
    with open('index.html', 'r') as f:
        html = f.read()
        window.load_html(html)

window = webview.create_window('PDV', js_api=pdv)
thread = Thread(target=load_html, args=(window,))
thread.start()
webview.start(debug=True)