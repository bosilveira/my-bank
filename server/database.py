import mysql.connector


mydb = mysql.connector.connect(
    host="localhost:3307",
    user="bloxs",
    passwd="bloxs123"
)

my_cursor = mydb.cursor()
my_cursor.execute("CREATE DATABASE db")
my_cursor.execute("SHOW DATABASES")
for db in my_cursor:
    print(db)