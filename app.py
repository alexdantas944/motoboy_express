from flask import Flask, render_template, request, jsonify
from supabase_client import supabase

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/localizacao', methods=['POST'])
def salvar_localizacao():
    data = request.json
    supabase.table("localizacao_motoboy").upsert(data).execute()
    return jsonify({"status": "ok"})

@app.route('/pedido', methods=['POST'])
def salvar_pedido():
    data = request.json
    supabase.table("pedidos").insert(data).execute()
    return jsonify({"status": "pedido registrado"})

if __name__ == '__main__':
    app.run(debug=True)