from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import psycopg2

app = FastAPI()

# Example of a Pydantic model for a request body
class Item(BaseModel):
    name: str
    description: str

# Connect to the PostgreSQL database
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",  # change to your DB host if needed
        database="your_database",
        user="your_user",
        password="your_password"
    )
    return conn

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.post("/items/")
def create_item(item: Item):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO items (name, description) VALUES (%s, %s) RETURNING id;",
        (item.name, item.description)
    )
    item_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"id": item_id, "name": item.name, "description": item.description}

@app.get("/items/{item_id}")
def get_item(item_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM items WHERE id = %s;", (item_id,))
    item = cur.fetchone()
    cur.close()
    conn.close()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"id": item[0], "name": item[1], "description": item[2]}

# More routes can be added here for additional CRUD operations

