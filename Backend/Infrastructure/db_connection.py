import psycopg2
from psycopg2.extras import RealDictCursor

def db_conn():
    return psycopg2.connect(
        database="mydatabase",
        host="db",  # Use 'db' because it's the Docker service name
        user="myuser",
        password="mypassword",
        port=5432  # Update port to match docker-compose.yml
    )
