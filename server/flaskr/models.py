from flaskr import db
from typing import List, Literal
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String, func
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import BIGINT, Integer, NVARCHAR, String, TIMESTAMP, Boolean, UUID, Numeric, Date, DateTime
from sqlalchemy.dialects.mysql import VARCHAR, NVARCHAR
import datetime
from sqlalchemy import types
from typing import Type
import uuid
import decimal
import enum


class Pessoa(db.Model):
    """
    Classe que representa uma pessoa no banco de dados.

    Attributes:
        __tablename__ (str): O nome da tabela do banco de dados usada para armazenar instâncias desta classe.
        idPessoa (Mapped[uuid.UUID]): O identificador único da pessoa. Este é uma coluna mapeada e serve como chave primária da tabela.
        nome (Mapped[str]): O nome da pessoa.
        cpf (Mapped[str]): O CPF da pessoa.
        dataNascimento (Mapped[datetime.date]): A data de nascimento da pessoa.
        usuario (Mapped[Usuario]): O usuário associado a esta pessoa. Esta é uma relação mapeada.
        contas (Mapped[List[Conta]]): A lista de contas associadas a esta pessoa. Esta é uma relação mapeada.

    Methods:
        __init__(self, nome, cpf, dataNascimento):
            Inicializa uma nova instância da classe Pessoa com o nome, CPF e data de nascimento fornecidos.
        __repr__(self):
            Retorna uma representação em string do objeto Pessoa.
        serializar(self):
            Retorna uma representação em dicionário do objeto Pessoa, incluindo objetos de Usuário e Conta associados.

    """
    __tablename__ = 'Pessoa'
    idPessoa: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(255))
    cpf: Mapped[str] = mapped_column(String(30))
    dataNascimento: Mapped[datetime.date]
    usuario: Mapped["Usuario"] = relationship(back_populates="pessoa")
    contas: Mapped[List["Conta"]] = relationship( back_populates="pessoa", cascade="all, delete-orphan" )

    def __init__(self, nome, cpf, dataNascimento):
        self.idPessoa = uuid.uuid4()
        self.nome = nome
        self.cpf = cpf
        self.dataNascimento = dataNascimento

    def __repr__(self) -> str:
        return f"Usuário (id: {self.idPessoa!r}, nome: {self.nome!r}, CPF: {self.cpf!r})"
    
    def serializar(self):
        return {
            'idPessoa': self.idPessoa,
            'idUsuario': self.usuario.idUsuario,
            'flagAtivo': self.usuario.flagAtivo,
            'nome': self.nome,
            'cpf': self.cpf,
            'nascimento': self.dataNascimento.strftime('%d/%m/%Y'),
            'email': self.usuario.email,
            'contas': [ conta.serializar_simples() for conta in self.contas ]
        }


class TipoUsuario(enum.Enum):
    ADMINSTRADOR = "admnistrador"
    EXECUTIVO = "executivo"
    ANALISTA = "analista"
    CLIENTE = "cliente"

class Usuario(db.Model):
    """
    Classe que representa um usuário no sistema.

    Attributes:
        __tablename__ (str): O nome da tabela do banco de dados usada para armazenar instâncias desta classe.
        idUsuario (Mapped[uuid.UUID]): O identificador único da pessoa. Este é uma coluna mapeada e serve como chave primária da tabela.
        idPessoa (Mapped[uuid.UUID]): O UUID chave estrangeira da pessoa associada ao usuário.
        email (Mapped[str]): O endereço de e-mail do usuário.
        senha (Mapped[str]): A senha criptografada do usuário.
        tipoUsuario (Mapped[TipoUsuario]): O tipo de usuário.
        flagAtivo (Mapped[bool]): Flag que indica se o usuário está ativo.
        pessoa (Mapped[Pessoa]): A pessoa associada ao usuário.

    Methods:
        __init__(self, pessoa, email='', senha='', tipoUsuario=TipoUsuario.CLIENTE, flagAtivo=False):
            Inicializa uma nova instância da classe Usuario com os dados fornecidos.
        __repr__(self):
            Retorna uma representação em string da instância de Usuario.
    """    
    __tablename__ = 'Usuario'
    idUsuario: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    idPessoa: Mapped[uuid.UUID] = mapped_column(ForeignKey('Pessoa.idPessoa'))
    email: Mapped[str] = mapped_column(String(255))
    senha: Mapped[str] = mapped_column(String(255))
    tipoUsuario: Mapped[TipoUsuario]
    flagAtivo: Mapped[bool]
    pessoa: Mapped["Pessoa"] = relationship(back_populates="usuario")

    def __init__(self, pessoa, email = '', senha = '', tipoUsuario = TipoUsuario.CLIENTE, flagAtivo = False):
        self.idUsuario = uuid.uuid4()
        self.pessoa = pessoa
        self.email = email
        self.senha = senha
        self.tipoUsuario = tipoUsuario
        self.flagAtivo = flagAtivo

    def __repr__(self) -> str:
        return f"Usuário (id: {self.idUsuario!r}, nome: {self.email!r}, CPF: {self.tipoUsuario!r})"

class Conta(db.Model):
    """
    Classe que representa uma conta no sistema.

    Attributes:
        __tablename__ (str): O nome da tabela no banco de dados.
        idConta (Mapped[uuid.UUID]): A chave primária UUID da conta.
        idPessoa (Mapped[uuid.UUID]): A chave estrangeira UUID da pessoa associada à conta.
        saldo (Mapped[decimal.Decimal]): O saldo da conta.
        limiteSaqueDiario (Mapped[decimal.Decimal]): O limite diário para saques da conta.
        flagAtivo (Mapped[bool]): Flag que indica se a conta está ativa.
        tipoConta (Mapped[int]): O tipo de conta.
        dataCriacao (Mapped[datetime.datetime]): A data de criação da conta.
        pessoa (Mapped["Pessoa"]): A pessoa associada à conta.
        transacoes (Mapped[List["Transacao"]]): As transações associadas à conta.

    Methods:
        __init__(self, pessoa, saldo=0, limiteSaqueDiario=0, tipoConta=0, flagAtivo=True):
            Inicializa uma nova instância da classe Conta.
        __repr__(self):
            Retorna uma representação em string da instância da classe Conta.
        serializar_simples(self):
            Retorna um dicionário com informações simples da conta.
        serializar_completo(self):
            Retorna um dicionário com informações detalhadas da conta e suas transações.
    """
    __tablename__ = 'Conta'
    idConta: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    idPessoa: Mapped[uuid.UUID] = mapped_column(ForeignKey('Pessoa.idPessoa'))
    saldo: Mapped[decimal.Decimal] = mapped_column(Numeric())
    limiteSaqueDiario: Mapped[decimal.Decimal] = mapped_column(Numeric())
    flagAtivo: Mapped[bool]
    tipoConta: Mapped[int] = mapped_column(Integer())
    dataCriacao: Mapped[datetime.datetime] = mapped_column(insert_default=func.now())
    pessoa: Mapped["Pessoa"] = relationship(back_populates="contas")
    transacoes: Mapped[List["Transacao"]] = relationship(back_populates="conta")


    def __init__(self, pessoa, saldo = 0, limiteSaqueDiario = 0, tipoConta = 0, flagAtivo = True):
        self.idConta = uuid.uuid4()
        self.pessoa = pessoa
        self.saldo = saldo
        self.limiteSaqueDiario = limiteSaqueDiario
        self.tipoConta = tipoConta
        self.flagAtivo = flagAtivo

    def __repr__(self) -> str:
        return f"Conta (código: {self.idConta!r}, tipo: {self.tipoConta!r})"

    def serializar_simples(self):
        return {
            'idConta': self.idConta,
            'saldo': self.saldo,
            'limiteSaqueDiario': self.limiteSaqueDiario,
            'flagAtivo': self.flagAtivo,
            'tipoConta': self.tipoConta,
            'dataCriacao': self.dataCriacao,
        }

    def serializar_completo(self):
        return {
            'idConta': self.idConta,
            'idPessoa': self.idPessoa,
            'idUsuario': self.pessoa.usuario.idUsuario,
            'saldo': self.saldo,
            'limiteSaqueDiario': self.limiteSaqueDiario,
            'flagAtivo': self.flagAtivo,
            'tipoConta': self.tipoConta,
            'dataCriacao': self.dataCriacao,
            'transacoes': [ transacao.serializar_simples() for transacao in self.transacoes ]
        }

class Transacao(db.Model):
    """
    Classe que representa uma transação no sistema.

    Attributes:
        __tablename__ (str): O nome da tabela do banco de dados usada para armazenar instâncias desta classe.
        idTransacao (Mapped[uuid.UUID]): O identificador único da transação. Esta é uma coluna mapeada e serve como chave primária da tabela.
        idConta (Mapped[uuid.UUID]): O identificador único da conta associada a esta transação. Esta é uma coluna mapeada e serve como chave estrangeira para a tabela 'Conta'.
        valor (Mapped[decimal.Decimal]): O valor da transação
        dataTransacao (Mapped[datetime.datetime]): A data e hora da transação. Esta é uma coluna mapeada com valor padrão.
        conta (Mapped["Conta"]): A conta associada a esta transação. Esta é uma relação mapeada.

    Methods:
        __init__(self, conta, valor=0.0): Inicializa uma nova instância da classe Transacao com a conta associada e o valor fornecido.
        serializar_simples(self): Retorna uma representação em dicionário da transação, contendo os atributos básicos.
        serializar_completo(self): Retorna uma representação em dicionário completa da transação, contendo informações adicionais da conta associada e da pessoa e usuário proprietários da conta.
    """
    __tablename__ = 'Transacao'
    idTransacao: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    idConta: Mapped[uuid.UUID] = mapped_column(ForeignKey('Conta.idConta'))
    valor: Mapped[decimal.Decimal] = mapped_column(Numeric(precision=2))
    dataTransacao: Mapped[datetime.datetime] = mapped_column(insert_default=func.now())
    conta: Mapped["Conta"] = relationship(back_populates="transacoes")

    def __init__(self, conta, valor = 0.0):
        self.idTransacao = uuid.uuid4()
        self.conta = conta
        self.valor = valor

    def serializar_simples(self):
        return {
            'idTransacao': self.idTransacao,
            'valor': self.valor,
            'dataTransacao': self.dataTransacao,
        }

    def serializar_completo(self):
        return {
            'idTransacao': self.idConta,
            'idConta': self.idConta,
            'idPessoa': self.conta.pessoa.idPessoa,
            'idUsuario': self.conta.pessoa.usuario.idUsuario,
            'valor': self.valor,
            'dataTransacao': self.dataTransacao,
        }