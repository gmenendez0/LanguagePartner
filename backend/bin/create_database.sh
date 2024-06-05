#!/bin/bash

# Me muevo al dir actual
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR" || exit

# Load environment variables from .env file
source ../.env

# Check if the database exists
echo "--- DATABASE CREATOR: Checking if database $DB_NAME exists..."
DB_EXISTS=$(sudo -u postgres PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -lqt | cut -d \| -f 1 | grep -w "$DB_NAME")

# If the database does not exist, create it
if [ -z "$DB_EXISTS" ]; then
    sudo -u postgres PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    if [ $? -eq 0 ]; then
        echo "--- DATABASE CREATOR: Database $DB_NAME created successfully."
    else
        echo "--- DATABASE CREATOR: Error creating database $DB_NAME."
    fi
else
    echo "--- DATABASE CREATOR: Database $DB_NAME already exists, skipping creation."
fi

cd - || exit