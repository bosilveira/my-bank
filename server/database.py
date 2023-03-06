import mysql.connector


mydb = mysql.connector.connect(
    host="192.168.1.4:3306",
    user="root",
    passwd="password"
)

my_cursor = mydb.cursor()
my_cursor.execute("CREATE DATABASE db")
my_cursor.execute("SHOW DATABASES")
for db in my_cursor:
    print(db)