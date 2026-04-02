#!/bin/bash

OWNER="ndh-anh"
REPO="e-commerce"

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Exit if branch is develop
if [ "$BRANCH" = "develop" ]; then
  echo "On 'develop' branch. Exiting..."
  exit 0
fi



# Get the PR info for the current branch
PR_JSON=$(gh pr list --repo "$OWNER/$REPO" --head "$BRANCH" --json number,assignees -q '.[0]')
PR_NUMBER=$(echo "$PR_JSON" | jq -r '.number')
ASSIGNEES=($(echo "$PR_JSON" | jq -r '.assignees[].login'))

if [ -z "$PR_NUMBER" ]; then
  echo "No PR found for branch '$BRANCH'. Exiting..."
  exit 1
fi

if [ ${#ASSIGNEES[@]} -eq 0 ]; then
  echo "No assignees found on PR #$PR_NUMBER. Nothing to reset."
  exit 0
fi

echo "Found assignees: ${ASSIGNEES[*]}"
echo "Temporarily removing all assignees..."

# Remove all assignees
for user in "${ASSIGNEES[@]}"; do
  gh pr edit "$PR_NUMBER" --repo "$OWNER/$REPO" --remove-assignee "$user"
done

# Add them back
echo "Reassigning original assignees..."
for user in "${ASSIGNEES[@]}"; do
  gh pr edit "$PR_NUMBER" --repo "$OWNER/$REPO" --add-assignee "$user"
done