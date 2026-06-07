#!/bin/bash

OWNER="ndh-anh"
REPO="e-commerce"

# get user login
USERNAME=$(gh api user --jq .login)

if [ -z "$USERNAME" ]; then
    echo "not logged in to GitHub CLI, please login first"
    exit 1
fi

echo "user: $USERNAME"

# get issues assigned to user
ISSUES=$(gh issue list \
    -R "$OWNER/$REPO" \
    --assignee "$USERNAME" \
    --json number,title \
    -q '.[] | "\(.number): \(.title)"')

if [ -z "$ISSUES" ]; then
    echo "❗ No issues assigned to you could be found in $OWNER/$REPO."
    exit 0
fi

# select issue with fzf
SELECTED=$(echo "$ISSUES" | fzf \
    --prompt="📋 Select issue: " \
    --height=40% \
    --border)

if [ -z "$SELECTED" ]; then
    echo "👋 Exit."
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

git commit --allow-empty -m "Create PR"

git push -u origin "$BRANCH_NAME"

gh pr create \
  --draft \
  --repo "$OWNER/$REPO" \
  --title "$ISSUE_TITLE" \
  --body "Closes #$ISSUE_NUMBER" \
  --head "$BRANCH_NAME" \
  --assignee "$USERNAME" \
  ${LABELS:+--label "$LABELS"}