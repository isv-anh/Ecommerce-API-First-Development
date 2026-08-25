#!/bin/bash

set -e

echo "=== 1. Tạo môi trường ảo (.venv) ==="
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "Đã tạo môi trường ảo tại .venv"
else
    echo "Môi trường ảo .venv đã tồn tại."
fi

echo "=== 2. Cài đặt thư viện từ requirements.txt ==="
if [ -f "requirements.txt" ]; then
    # Dùng trực tiếp pip của venv để không cần chạy source
    ./.venv/bin/pip install --upgrade pip
    ./.venv/bin/pip install -r requirements.txt
    echo "=== Cài đặt hoàn tất thành công! ==="
else
    echo "Lỗi: Không tìm thấy file requirements.txt trong thư mục hiện tại!"
    exit 1
fi