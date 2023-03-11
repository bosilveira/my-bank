from unittest import TestCase
from flask import current_app as app
from datetime import datetime, timedelta
import jwt
from flask_sqlalchemy import SQLAlchemy
from flaskr import create_app
from .models import Pessoa, TipoUsuario, Usuario
from flask import jsonify, json
import pytest



def test_usuario():
    # Prepare the test data
    pessoa = Pessoa('Pessoa', '123.456.789-10', '15/10/1985')
    usuario = Usuario(pessoa, 'pessoa@mail.com', '123', tipoUsuario = TipoUsuario.CLIENTE, flagAtivo = False)
    assert usuario.pessoa.nome == "Pessoa"
    assert usuario.pessoa.cpf == "123.456.789-10"
    assert usuario.pessoa.dataNascimento == "15/10/1985"
    assert usuario.email == "pessoa@mail.com"
    assert usuario.senha == "123"
    assert usuario.tipoUsuario == TipoUsuario.CLIENTE
    assert usuario.flagAtivo == False

    
def test_token_admin():
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valid
    """
    flask_app = create_app()

    # Create a test client using the Flask application configured for testing
    with flask_app.test_client() as test_client:
        response = test_client.get('/admin')
        assert response.status_code == 200
        token = json.loads(response.data)['token']
        headers = {'x-access-tokens': token}
        response2 = test_client.get('/clientes', headers=headers)
        assert response2.status_code == 200
        response3 = test_client.get('/contas', headers=headers)
        assert response3.status_code == 200
        response4 = test_client.get('/transacoes', headers=headers)
        assert response4.status_code == 200

