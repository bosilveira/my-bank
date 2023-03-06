from . import db
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
    Class: Pessoa

    A class representing a person in a database table, with a one-to-one relationship to Usuario and a one-to-many relationship to Conta.

    Attributes:
        idPessoa (uuid.UUID): Primary key for the Pessoa table.
        nome (str): Person's name.
        cpf (str): Person's CPF (Brazilian ID).
        dataNascimento (datetime.date): Person's date of birth.
        usuario (Usuario): A one-to-one relationship to Usuario.
        contas (List[Conta]): A one-to-many relationship to Conta.

    Methods:
        __init__(self, nome, cpf, dataNascimento):
            Class constructor for initializing a Pessoa instance.
        __repr__(self) -> str:
            Returns a string representation of a Pessoa instance.
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
    Class:
    Person

    Description:
    This class represents a person in a database. The attributes are idPerson (primary key), name, itin, and birthdate.

    Attributes:
    idPerson (Integer): The primary key of the person
    name (String): The name of the person
    itin (String): The individual taxpayer identification number of the person
    birthdate (Date): The birthdate of the person
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
    """Account table representation.

    Attributes:
    __tablename__ (str): Name of the table in the database.
    idAccount (int): Primary key of the table.
    idPerson (int): Foreign key to the 'person' table.
    value (float): Value of the account.
    withdrawDailyLimit (float): Maximum amount that can be withdrawn from the account in one day.
    active (boolean): Flag to check if the account is active or not.
    accountType (int): Type of the account.
    createdAt (date): Date when the account was created.
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
    This class is the ORM representation of a financial transaction in a database.

    Attributes
    ----------
    idTransaction : int
        Unique identifier for the transaction.
    idAccount : int
        Unique identifier for the account associated with the transaction.
    value : float
        The amount of money associated with the transaction.
    type : string
        The type of transaction - deposit, withdrawal, etc.
    date : date
        The date the transaction took place.
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