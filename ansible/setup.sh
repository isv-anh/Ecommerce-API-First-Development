#!/bin/bash
set -o nounset -o errexit -o pipefail

# Xuất tất cả biến từ file .env
ENV_FILE_MAIN=$(pwd)/.env
if [ -f "$ENV_FILE_MAIN" ]; then
    set -o allexport
    source "$ENV_FILE_MAIN"
    set +o allexport
fi

POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

if [ -z "${POSTGRES_USER:-}" ]; then
    read -p "Nhập POSTGRES_USER: " POSTGRES_USER
fi

if [ -z "${POSTGRES_PASSWORD:-}" ]; then
    read -sp "Nhập POSTGRES_PASSWORD: " POSTGRES_PASSWORD
    echo
fi

while [ -z "${ADMIN_PASSWORD:-}" ] || [[ "$ADMIN_PASSWORD" == *'$admin_password$'* ]]; do
    if [ -n "${ADMIN_PASSWORD:-}" ]; then
        echo 'ADMIN_PASSWORD không được chứa chuỗi $admin_password$. Vui lòng nhập lại.'
    fi
    read -sp "Nhập ADMIN_PASSWORD: " ADMIN_PASSWORD
    echo
done

if [ -z "${DB_NAME:-}" ]; then
    read -p "Nhập DB_NAME: " DB_NAME
fi

if [ -z "${DB_PORT:-}" ]; then
    read -p "Nhập DB_PORT (mặc định: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-5432}
fi

if [ -z "${DB_HOST:-}" ]; then
    read -p "Nhập DB_HOST (mặc định: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
fi


if command -v git >/dev/null 2>&1; then
    GIT_USER_NAME=$(git config --global user.name || true)
    GIT_USER_EMAIL=$(git config --global user.email || true)

    if [ -z "$GIT_USER_NAME" ]; then
        read -p "Nhập Git user.name: " GIT_USER_NAME
        git config --global user.name "$GIT_USER_NAME"
        echo "Đã đặt Git user.name: $GIT_USER_NAME"
    fi

    if [ -z "$GIT_USER_EMAIL" ]; then
        read -p "Nhập Git user.email: " GIT_USER_EMAIL
        git config --global user.email "$GIT_USER_EMAIL"
        echo "Đã đặt Git user.email: $GIT_USER_EMAIL"
    fi
else
    echo "Git chưa được cài đặt hoặc không có trong PATH. Bỏ qua cấu hình Git toàn cục."
fi

# Ghi tất cả biến môi trường vào file .env
cat > "$ENV_FILE_MAIN" <<EOF
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ADMIN_PASSWORD=$ADMIN_PASSWORD
DB_NAME=$DB_NAME
DB_PORT=$DB_PORT
DB_HOST=$DB_HOST
EOF

# Tạo thư mục /logs nếu chưa tồn tại
# Tạo trước khi chạy ansible để lưu log của ansible
if [ ! -d "/logs" ]; then
    echo "Thư mục /logs chưa tồn tại. Đang tạo..."
    sudo mkdir /logs
    sudo chmod 0777 /logs
    echo "Đã tạo thư mục /logs (quyền: 0777)"
else
    echo "Thư mục /logs đã tồn tại"
fi

ansible-playbook ~/e-commerce/setup.yaml --ask-become-pass \
    -e "pg_user=${POSTGRES_USER}" \
    -e "pg_password=${POSTGRES_PASSWORD}" \
    -e "admin_password=${ADMIN_PASSWORD}" \
    -e "db_host=${DB_HOST}" \
    -e "db_port=${DB_PORT}" \
    -e "db_name=${DB_NAME}"
