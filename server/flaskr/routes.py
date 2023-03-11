import uuid
from flask import request
from datetime import datetime, timedelta
from flask import current_app as app
from flask_cors import cross_origin
from flaskr import db
from flaskr.models import Pessoa, Usuario, Conta, Transacao, TipoUsuario
from flask import jsonify
from sqlalchemy import select
import jwt
from  werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

def token_cliente(route):
    """
    Uma função decoradora que verifica se um token de acesso válido está presente nos cabeçalhos da solicitação.
    Se um token de acesso válido estiver presente, a função decoradora verifica o nível de acesso do usuário associado ao token.
    Se o usuário tiver o nível de acesso necessário, o decorador chama a função de rota original com o nível de acesso e quaisquer outros argumentos e palavras-chave que foram passados para a função decoradora.

    Args:
        route (function): A função de rota original que esta decoradora irá envolver.

    Returns:
        function: Uma função decoradora que pode ser usada para proteger rotas que requerem um token de acesso válido para serem acessadas.

    Raises:
        Exception: Se houver um erro durante o processo de decodificação ou verificação, o decorador retorna uma resposta JSON indicando que o acesso é inválido, com um código de status HTTP 401.

    Note:
        Esta função decoradora pressupõe que o token de acesso é passado no cabeçalho 'x-access-tokens' da solicitação HTTP recebida e que o token de acesso foi criado usando o algoritmo HMAC-SHA256. A chave secreta usada para assinar o token é assumida como armazenada na configuração do aplicativo Flask como a variável 'SECRET_KEY'.
    """
    @wraps(route)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']
        if not token:
            return jsonify({'mensagem': 'Necessário apresentar token'}), 400 #Bad Request
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            if data.get('acesso') == 'ADMIN':
                acesso = 'ADMIN'
            else:
                acesso = data.get('acesso') 
                usuario = db.session.scalars(select(Usuario).where(Usuario.idUsuario == uuid.UUID(acesso) )).first()
                if usuario == None:
                    raise Exception('Cliente não encontrado')
                if not usuario.flagAtivo:
                    raise Exception('Cliente bloqueado')

        except Exception as e:
                return jsonify({'mensagem': 'Acesso inválido; ' + str(e)}), 401 #Unauthorized
    
        return route(acesso, *args, **kwargs)
    return decorator


def token_admin(route):
    """
    Uma função decoradora que verifica se um token de acesso válido com nível de acesso 'ADMIN' está presente nos cabeçalhos da requisição.
    Se um token de acesso válido estiver presente e o usuário tiver acesso de 'ADMIN', a função decoradora chama a função de rota original com o nível de acesso e quaisquer outros argumentos e palavras-chave que foram passados para a função decoradora.

    Args:
        route (function): A função de rota original que esta decoradora irá envolver.

    Returns:
        function: Uma função decoradora que pode ser usada para proteger rotas que requerem um token de acesso válido com nível de acesso 'ADMIN' para serem acessadas.

    Raises:
        Exception: Se houver um erro durante o processo de decodificação ou verificação, a decoradora retorna uma resposta JSON indicando que o token de acesso é inválido, com um código de status HTTP 401.

    Note:
        Esta função decoradora assume que o token de acesso é passado no cabeçalho 'x-access-tokens' da requisição HTTP de entrada e que o token de acesso foi criado usando o algoritmo HMAC-SHA256. A chave secreta usada para assinar o token é assumida estar armazenada na configuração do aplicativo Flask como a variável 'SECRET_KEY'.
    """    
    @wraps(route)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']
        if not token:
            return jsonify({'mensagem': 'Necessário apresentar token'}), 400 #Bad Request
        try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                if data.get('acesso') == 'ADMIN':
                    acesso = 'ADMIN'
                else:
                    raise Exception() 
        except:
                return jsonify({'mensagem': 'Token inválido'}), 401 #Unauthorized
        return route(acesso, *args, **kwargs)
    return decorator


@app.route("/admin")
@cross_origin()
def obter_token_admin():
    """
    Esta rota cria um token de acesso com o nível de acesso 'ADMIN' e o retorna como uma resposta JSON.
    A rota é acessível apenas publicamente, ou seja, qualquer pessoa pode acessá-la. Quando acessada, a função jwt.encode é usada para criar um token codificado com um tempo de expiração de 30 minutos a partir do momento em que o token foi criado. O token é retornado em uma resposta JSON juntamente com o código HTTP 200, indicando que a solicitação foi bem-sucedida.
    Note que o segredo usado para assinar o token é assumido estar armazenado na configuração do aplicativo Flask como a variável 'SECRET_KEY'.
    """
    token = jwt.encode({
            'acesso': 'ADMIN',
            'exp' : datetime.utcnow() + timedelta(minutes = 30)
        }, app.config['SECRET_KEY'])
    return jsonify({'token': token}), 200


# Rotas de Controle de Cliente

@app.route("/clientes")
@token_admin
def listar_clientes(acesso):
    args = request.args
    nome = args.get("name", default="", type=str)
    pessoas = db.session.scalars(select(Pessoa).where(Pessoa.nome.like(f'%{nome}%')).order_by(Pessoa.nome)).all()
    return [ pessoa.serializar() for pessoa in pessoas ], 200


@app.route("/cliente/inscrever", methods=["POST"])
@cross_origin()
def inscrever_cliente():
    try:
        dados = request.get_json(force=True, silent=True)
        if dados == None:
            raise Exception('Informar dados de cadastro')
        for key in ['nome', 'cpf', 'nascimento', 'email', 'senha']:
            if key not in dados:
                raise Exception('Informar ' + key)
            if len(dados[key]) == 0:
                raise Exception('Informar ' + key)
            
        nome = dados.get("nome")
        cpf = dados.get("cpf")
        nascimento = datetime.strptime(dados.get("nascimento"),'%d/%m/%Y')
        email =  dados.get("email")
        senha =  generate_password_hash(dados.get('senha'), method='sha256')

        verificar_cpf = db.session.scalars(select(Pessoa).where(Pessoa.cpf == cpf)).all()
        if len(verificar_cpf) > 0:
            raise Exception('CPF já existente')
        verificar_email = db.session.scalars(select(Usuario).where(Usuario.email == email)).all()
        if len(verificar_email) > 0:
            raise Exception('Email já existente')
        
        pessoa = Pessoa(nome, cpf, nascimento)
        usuario = Usuario(pessoa, email, senha, tipoUsuario = TipoUsuario.CLIENTE, flagAtivo = True)
        db.session.add_all([pessoa, usuario])
        db.session.commit()

        return jsonify({'cliente': pessoa.serializar()}), 201
    except Exception as e:
        return jsonify({'erro': str(e)}), 400


# @app.route("/cliente/liberar/<uuid:idUsuario>")
# @token_admin
# def liberar_cliente(acesso, idUsuario):
#     try:
#         print(idUsuario)
#         usuario = db.session.scalars(select(Usuario).where(Usuario.idUsuario == idUsuario)).first()
#         if usuario == None:
#             raise Exception('Não encontrado')
#         usuario.flagAtivo = True
#         db.session.add(usuario)
#         db.session.commit()
#         return jsonify({'mensagem': 'Cliente liberado'}), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400


# @app.route("/cliente/bloquear/<uuid:idUsuario>")
# @token_admin
# def bloquear_cliente(acesso, idUsuario):
#     try:
#         print(idUsuario)
#         usuario = db.session.scalars(select(Usuario).where(Usuario.idUsuario == idUsuario)).first()
#         if usuario == None:
#             raise Exception('Não encontrado')
#         usuario.flagAtivo = False
#         db.session.add(usuario)
#         db.session.commit()
#         return jsonify({'mensagem': 'Cliente bloqueado'}), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400
    

@app.route("/cliente/logar", methods=["POST"])
@cross_origin()
def obter_token_cliente():
    try:
        dados = request.get_json(force=True, silent=True)

        if dados == None:
            raise Exception('Informar dados de acesso')
        for key in ['email', 'senha']:
            if key not in dados:
                raise Exception('Informar ' + key)
            if len(dados[key]) == 0:
                raise Exception('Informar ' + key)
            
        email =  dados.get("email")
        usuario = db.session.scalars(select(Usuario).where(Usuario.email == email)).first()

        if usuario == None:
            raise Exception('Verificar email')
        if not usuario.flagAtivo:
            raise Exception('Usuário bloqueado')
        
        if check_password_hash(usuario.senha, dados.get("senha")):
            token = jwt.encode({
                'acesso': str(usuario.idUsuario),
                'exp' : datetime.utcnow() + timedelta(minutes = 30)
            }, app.config['SECRET_KEY'])
            return jsonify({'token': token}), 200
        else:
            raise Exception('Autenticação inválida')
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 401


@app.route("/cliente/carteira")
@cross_origin()
@token_cliente
def detalhar_carteira(acesso):
    try:
        cliente = db.session.scalars(select(Pessoa).where(Pessoa.usuario.has(idUsuario = uuid.UUID(acesso)))).first()
        if cliente == None:
            raise Exception('Não encontrado')
        if str(cliente.usuario.idUsuario) != acesso and acesso != 'ADMIN':
            raise Exception('Não autorizado')
        
        return jsonify(cliente.serializar()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 400


@app.route("/cliente/transacoes")
@cross_origin()
@token_cliente
def detalhar_transacoes(acesso):
    try:        
        cliente = db.session.scalars(select(Pessoa).where(Pessoa.usuario.has(idUsuario = uuid.UUID(acesso)))).first()
        if cliente == None:
            raise Exception('Não encontrado')
        transacoes = db.session.scalars(select(Transacao).where(Transacao.conta.has(idPessoa = cliente.idPessoa)).order_by(Transacao.dataTransacao.desc())).all()
        return jsonify([ transacao.serializar_completo() for transacao in transacoes ]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 400


# @app.route("/cliente/<uuid:idPessoa>")
# @token_cliente
# def detalhar_cliente(acesso, idPessoa):
#     try:
#         cliente = db.session.scalars(select(Pessoa).where(Pessoa.idPessoa == idPessoa)).first()
#         if cliente == None:
#             raise Exception('Não encontrado')
#         if str(cliente.usuario.idUsuario) != acesso and acesso != 'ADMIN':
#             raise Exception('Não autorizado')
#         return jsonify(cliente.serializar()), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400



# Rotas de Controle de Conta

# @app.route("/contas")
# @token_admin
# def listar_contas(acesso):
#     contas = db.session.scalars(select(Conta)).all()
#     return [ conta.serializar_completo() for conta in contas ], 200

@app.route("/conta/criar", methods=["POST"])
@cross_origin()
@token_cliente
def criar_conta(acesso):
    try:
        dados = request.get_json(force=True, silent=True)
        if dados == None:
            raise Exception('Informar dados da conta')
        for key in ['idPessoa']:
            if key not in dados:
                raise Exception('Informar ' + key)
            if len(dados[key]) == 0:
                raise Exception('Informar ' + key)
            
        idPessoa = uuid.UUID(dados.get("idPessoa"))
        cliente = db.session.scalars(select(Pessoa).where(Pessoa.idPessoa == idPessoa)).first()

        if cliente == None:
            raise Exception('Não encontrado')
        if str(cliente.usuario.idUsuario) != acesso and acesso != 'ADMIN':
            raise Exception('Não autorizado')
        
        conta = Conta(cliente)
        db.session.add(conta)
        db.session.commit()

        return jsonify(conta.serializar_completo()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 400


# @app.route("/conta/ativar/<uuid:idConta>")
# @token_cliente
# def ativar_conta(acesso, idConta):
#     try:
#         conta = db.session.scalars(select(Conta).where(Conta.idConta == idConta)).first()
#         if conta == None:
#             raise Exception('Não encontrada')
#         if str(conta.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
#             raise Exception('Não autorizado')        
#         conta.flagAtivo = True
#         db.session.add(conta)
#         db.session.commit()
#         return jsonify({'mensagem': 'Conta liberada'}), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400

# @app.route("/conta/bloquear/<uuid:id>")
# @token_cliente
# def bloquear_conta(acesso, idConta):
#     try:
#         conta = db.session.scalars(select(Conta).where(Conta.idConta == idConta)).first()
#         if conta == None:
#             raise Exception('Não encontrada')
#         if str(conta.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
#             raise Exception('Não autorizado')        
#         conta.flagAtivo = True
#         db.session.add(conta)
#         db.session.commit()
#         return jsonify({'mensagem': 'Conta bloqueada'}), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400
    
# @app.route("/conta/<uuid:idConta>")
# @token_cliente
# def detalhar_conta(acesso, idConta):
#     try:
#         conta = db.session.scalars(select(Conta).where(Conta.idConta == idConta)).first()
#         if conta == None:
#             raise Exception('Não encontrada')
#         if str(conta.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
#             raise Exception('Não autorizado')        
#         return jsonify(conta.serializar_completo()), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400
    
# @app.route("/conta/<uuid:idConta>/transacoes")
# @token_cliente
# def listar_transacoes_conta(acesso, idConta):
#     try:
#         conta = db.session.scalars(select(Conta).where(Conta.idConta == idConta)).first()
#         if conta == None:
#             raise Exception('Não encontrada')
#         if str(conta.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
#             raise Exception('Não autorizado')        
#         return jsonify([ transacao.serializar_completo() for transacao in conta.transacoes]), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400

# # Rotas de Controle de Transacao

# @app.route("/transacoes")
# @token_admin
# def listar_transacoes(acesso):
#     transacoes = db.session.scalars(select(Transacao)).all()
#     return [ transacao.serializar_completo() for transacao in transacoes ], 200

@app.route("/transacao/depositar", methods=["POST"])
@cross_origin()
@token_cliente
def depositar(acesso):
    try:
        dados = request.get_json(force=True, silent=True)
        if dados == None:
            raise Exception('Informar dados da conta')
        for key in ['idConta', 'valor']:
            if key not in dados:
                raise Exception('Informar ' + key)
            if len(dados[key]) == 0:
                raise Exception('Informar ' + key)
            
        valor = float(dados.get("valor"))
        if valor <= 0:
            raise Exception('Inválido')
        idConta = uuid.UUID(dados.get("idConta"))
        conta = db.session.scalars(select(Conta).where(Conta.idConta == idConta)).first()

        if conta == None:
            raise Exception('Não encontrado')
        if str(conta.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
            raise Exception('Não autorizado')
        
        transacao = Transacao(conta, valor = valor)
        conta.saldo = float(conta.saldo) + valor
        db.session.add_all([transacao, conta])
        db.session.commit()

        return jsonify(transacao.serializar_completo()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 400


@app.route("/transacao/sacar", methods=["POST"])
@cross_origin()
@token_cliente
def sacar(acesso):
    try:
        dados = request.get_json(force=True, silent=True)
        if dados == None:
            raise Exception('Informar dados da conta')
        for key in ['idConta', 'valor']:
            if key not in dados:
                raise Exception('Informar ' + key)
            if len(dados[key]) == 0:
                raise Exception('Informar ' + key)
            
        valor = float(dados.get("valor"))
        if valor <= 0:
            raise Exception('Inválido')
        idConta = uuid.UUID(dados.get("idConta"))
        conta = db.session.scalars(select(Conta).where(Conta.idConta == idConta)).first()

        if conta == None:
            raise Exception('Não encontrado')
        if str(conta.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
            raise Exception('Não autorizado')
        
        transacao = Transacao(conta, valor = -valor)
        if float(conta.saldo) - valor < 0 or float(conta.limiteSaqueDiario) - valor < 0:
            raise Exception('Saldo insuficiente ou limite ultrapassado')
        
        conta.saldo = float(conta.saldo) - valor
        db.session.add_all([transacao, conta])
        db.session.commit()

        return jsonify(transacao.serializar_completo()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 400


# @app.route("/transacao/<uuid:idTransacao>")
# @token_cliente
# def detalhar_transacao(acesso, idTransacao):
#     try:
#         transacao = db.session.scalars(select(Transacao).where(Transacao.idTransacao == idTransacao)).first()
#         if transacao == None:
#             raise Exception('Não encontrada')
#         if str(transacao.conta.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
#             raise Exception('Não autorizado')        
#         return jsonify(transacao.serializar_completo()), 200
#     except Exception as e:
#         return jsonify({'erro': str(e)}), 400


@app.route("/transacao/transferir", methods=["POST"])
@cross_origin()
@token_cliente
def conciliar_transferencia(acesso):
    try:
        dados = request.get_json(force=True, silent=True)
        if dados == None:
            raise Exception('Informar dados da transferência')
        for key in ['idConta_remetente', 'idConta_destinatario', 'valor']:
            if key not in dados:
                raise Exception('Informar ' + key)
            if len(dados[key]) == 0:
                raise Exception('Informar ' + key)
            
        idConta_remetente = uuid.UUID(dados.get("idConta_remetente"))
        conta_remetente = db.session.scalars(select(Conta).where(Conta.idConta == idConta_remetente)).first()
        if conta_remetente == None:
            raise Exception('Não encontrado')
        if str(conta_remetente.pessoa.usuario.idUsuario) != acesso and acesso != 'ADMIN':
            raise Exception('Não autorizado')
        
        idConta_destinatario = uuid.UUID(dados.get("idConta_destinatario"))
        conta_destinatario = db.session.scalars(select(Conta).where(Conta.idConta == idConta_destinatario)).first()
        if conta_destinatario == None:
            raise Exception('Não encontrado')
        
        valor = float(dados.get("valor"))

        transacao_remetente = Transacao(conta_remetente, -abs(valor))
        transacao_destinatario = Transacao(conta_destinatario, abs(valor))

        if transacao_remetente.valor + float(conta_remetente.saldo) < 0 or transacao_remetente.valor + float(conta_remetente.limiteSaqueDiario) < 0:
            raise Exception('Saldo insuficiente ou limite ultrapassado')

        conta_remetente.saldo = float(conta_remetente.saldo) + transacao_remetente.valor
        conta_destinatario.saldo = float(conta_destinatario.saldo) + transacao_destinatario.valor

        db.session.add_all([transacao_remetente,transacao_destinatario, conta_remetente, conta_destinatario])
        db.session.commit()

        return jsonify( { 'remetente': transacao_remetente.serializar_completo(), 'destinatario': transacao_destinatario.serializar_completo() }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 400