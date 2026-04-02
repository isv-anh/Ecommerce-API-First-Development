#!/bin/bash

ENV_FILE=".env"

ENV_E_COMMERCE_API="./e-commerce-api/.env"

echo "setup environtment"

read -p "enter DB_USERNAME: " username
read -s -p "enter DB_PASSWORD: " password
read -p "enter DB_HOST (default: localhost): " db_host
read -p "enter DB_PORT (default: 5432): " db_port
read -p "enter DB_NAME: " db_name
read -p "enter SEFT_HOSTED_RUNNER_TOKEN: " seft_token
read -p "enter JWT_SECRET: " jwt_secret

if [ -z "$db_host" ]; then
    db_host="localhost"
fi
if [ -z "$db_port" ]; then
    db_port="5432"
fi

echo "DB_USERNAME=$username" > "$ENV_FILE"
echo "DB_PASSWORD=$password" >> "$ENV_FILE"
echo "DB_USERNAME=$username" > "$ENV_HRM_API"
echo "DB_PASSWORD=$password" >> "$ENV_HRM_API"

echo "DB_HOST=$db_host" >> "$ENV_FILE"
echo "DB_PORT=$db_port" >> "$ENV_FILE"
echo "DB_NAME=$db_name" >> "$ENV_FILE"
echo "DB_HOST=$db_host" >> "$ENV_HRM_API"
echo "DB_PORT=$db_port" >> "$ENV_HRM_API"
echo "DB_NAME=$db_name" >> "$ENV_HRM_API"

echo "RUNNER_TOKEN=$seft_token" >> "$ENV_FILE"
echo "JWT_SECRET=$jwt_secret" >> "$ENV_FILE"
echo "JWT_SECRET=$jwt_secret" >> "$ENV_HRM_API"

echo "UID=$(id -u)" >> "$ENV_FILE"
echo "GID=$(id -g)" >> "$ENV_FILE"

echo "saved $ENV_FILE"
