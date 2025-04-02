#!/bin/bash
set -e  # หยุด script ถ้าเจอ error

# รอให้ PostgreSQL พร้อม
echo "⏳ Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 3
done

echo "✅ PostgreSQL is up - running migrations"

# รันไฟล์ SQL ใน `Migration/Schema/`
for file in migrations/Schema/*.sql; do
  echo "📜 Running migration: $file"
  PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$file"
done

# รัน Seeder ถ้ามี
for file in migrations/Seeder/*.sql; do
  echo "🌱 Running seeder: $file"
  PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$file"
done

# รัน Flask
echo "🚀 Starting Flask Application"
exec flask run --host=0.0.0.0 --port=8000
