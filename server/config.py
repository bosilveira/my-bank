import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = 'my_secret_key'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://bloxs:bloxs123@localhost:3306/db_bloxs'
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

  #'mysql+pymysql://bloxs:bloxs123@localhost:3306/db_bloxs'
  #mysql+pymysql://username:password@hostname/database