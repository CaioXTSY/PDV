import webview
import json
from threading import Thread

class Produto:
    def __init__(self, nome, codigo, preco):
        self.nome = nome
        self.codigo = codigo
        self.preco = preco

    def to_dict(self):
        return {
            "nome": self.nome,
            "codigo": self.codigo,
            "preco": self.preco
        }

class PDV:
    def __init__(self):
        self.produtos = {}
        self.venda_atual = []
        self._load_from_file()

    def _load_from_file(self):
        try:
            with open("produtos.json", "r") as file:
                data = json.load(file)
                for item in data:
                    prod = Produto(item["nome"], item["codigo"], item["preco"])
                    self.produtos[item["codigo"]] = prod
        except FileNotFoundError:
            pass

    def _save_to_file(self):
        with open("produtos.json", "w") as file:
            json.dump([produto.to_dict() for produto in self.produtos.values()], file)

    def adicionar_produto(self, nome, codigo, preco):
        if float(preco) <= 0:
            return False
        else:
            self.produtos[codigo] = Produto(nome, codigo, preco)
            self._save_to_file()
            return True

    def remover_produto(self, codigo):
        if codigo in self.produtos:
            del self.produtos[codigo]
            self._save_to_file()
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
        total = sum(float(produto.preco) * int(quantidade) for produto, quantidade in self.venda_atual)
        self.venda_atual = []
        return total
    
    def get_venda_atual(self):
        return [{"nome": item[0].nome, "quantidade": item[1], "preco": item[0].preco} for item in self.venda_atual]

def load_html_with_assets(window):
    with open('index.html', 'r') as f:
        html_content = f.read()

    with open('styles.css', 'r') as f:
        css_content = f.read()

    html_content = html_content.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css_content}</style>')
    
    with open('scripts.js', 'r') as f:
        js_content = f.read()
        
    html_content = html_content.replace('<script src="script.js"></script>', f'<script>{js_content}</script>')
    
    window.load_html(html_content)

pdv = PDV()
window = webview.create_window('PDV', js_api=pdv)
thread = Thread(target=load_html_with_assets, args=(window,))
thread.start()
webview.start(debug=True)

window = webview.create_window('PDV', js_api=pdv)