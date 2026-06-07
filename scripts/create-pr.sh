#!/bin/bash

OWNER="ndh-anh"
REPO="e-commerce"

# Kiểm tra đang ở branch develop
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo "❗ Bạn đang ở branch '$CURRENT_BRANCH', vui lòng chuyển sang branch 'develop' trước."
    exit 1
fi

# Kiểm tra có file thay đổi chưa commit không
if [ -n "$(git status --porcelain)" ]; then
    echo "❗ Có file thay đổi chưa commit, vui lòng commit hoặc stash trước."
    git status --short
    exit 1
fi

# Lấy thông tin người dùng đang đăng nhập
USERNAME=$(gh api user --jq .login)

if [ -z "$USERNAME" ]; then
    echo "❗ Chưa đăng nhập GitHub CLI, vui lòng đăng nhập trước."
    exit 1
fi

echo "Người dùng: $USERNAME"

# Lấy danh sách issue được giao cho người dùng
ISSUES=$(gh issue list \
    -R "$OWNER/$REPO" \
    --assignee "$USERNAME" \
    --json number,title \
    -q '.[] | "\(.number): \(.title)"')

if [ -z "$ISSUES" ]; then
    echo "❗ Không tìm thấy issue nào được giao cho bạn trong $OWNER/$REPO."
    exit 0
fi

# Chọn issue bằng fzf
SELECTED=$(echo "$ISSUES" | fzf \
    --prompt="📋 Chọn issue: " \
    --height=40% \
    --border)

if [ -z "$SELECTED" ]; then
    echo "👋 Thoát."
    exit 0
fi

ISSUE_NUMBER=$(echo "$SELECTED" | cut -d':' -f1)
ISSUE_TITLE=$(echo "$SELECTED" | cut -d':' -f2- | xargs)

BRANCH_NAME=$(echo "$SELECTED" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E 's/[^a-z0-9]+/-/g' \
  | sed -E 's/^-+|-+$//g')

LABELS=$(gh issue view "$ISSUE_NUMBER" \
    --repo "$OWNER/$REPO" \
    --json labels \
    --jq '.labels[].name' \
    | paste -sd "," -)

git checkout -b "$BRANCH_NAME"

git commit --allow-empty -m "Tạo PR"

git push -u origin "$BRANCH_NAME"

gh pr create \
  --draft \
  --repo "$OWNER/$REPO" \
  --title "$ISSUE_TITLE" \
  --body "Closes #$ISSUE_NUMBER" \
  --head "$BRANCH_NAME" \
  --assignee "$USERNAME" \
  ${LABELS:+--label "$LABELS"}