#!/bin/bash

# Script to check GitHub Pages deployment status and URL
# Usage: ./scripts/check-deployment.sh [repo-owner] [repo-name]

REPO_OWNER="${1:-Gzeu}"
REPO_NAME="${2:-safesolidity-lite}"

echo "🔍 Checking deployment status for $REPO_OWNER/$REPO_NAME..."

# Get deployment environments
echo "📋 Fetching deployment environments..."
ENVIRONMENTS=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/environments" \
  -H "Accept: application/vnd.github.v3+json")

# Check if github-pages environment exists
if echo "$ENVIRONMENTS" | jq -e '.environments[] | select(.name == "github-pages")' > /dev/null; then
    echo "✅ GitHub Pages environment found"

    # Get the Pages URL
    PAGES_URL=$(echo "$ENVIRONMENTS" | jq -r '.environments[] | select(.name == "github-pages") | .html_url')

    if [ -n "$PAGES_URL" ] && [ "$PAGES_URL" != "null" ]; then
        echo "🚀 Live URL: $PAGES_URL"
        echo ""
        echo "📊 Checking if site is accessible..."
        if curl -s --head "$PAGES_URL" | head -n 1 | grep -q "200\|301\|302"; then
            echo "✅ Site is accessible!"
        else
            echo "⚠️  Site may not be fully deployed yet"
        fi
    else
        echo "⚠️  No Pages URL found in environment"
        echo "💡 The deployment might still be in progress"
    fi
else
    echo "❌ GitHub Pages environment not found"
    echo "💡 Make sure GitHub Pages is enabled in repository settings"
fi

echo ""
echo "🔧 Recent deployment runs:"
curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?per_page=5" \
  -H "Accept: application/vnd.github.v3+json" | \
  jq -r '.workflow_runs[] | select(.name | contains("Deploy to GitHub Pages")) | "\(.conclusion // "in_progress") - \(.html_url)"'
