#!/bin/bash
# IMPORTANT: run chmod +x create_database.sh to allow execution of this file
# IMPORTANT: to execute this run ./create_database.sh

# Load environment variables from .env file
source .env

# Check if the database exists
DB_EXISTS=$(PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -lqt | cut -d \| -f 1 | grep -w "$DB_NAME")

# If the database does not exist, create it
if [ -z "$DB_EXISTS" ]; then
    PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
else
    echo "Database $DB_NAME already exists, skipping creation."
fi