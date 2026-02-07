# Git Setup Guide

This guide walks you through setting up Git and pushing your code to GitHub.

## Prerequisites

- Git installed on your system
- GitHub account
- Repository created at: https://github.com/mhaack/sewing-tracker

## Initial Setup

### 1. Initialize Git Repository

```bash
# Navigate to project directory
cd /Users/mhaack/source/playground/sewing-tracker

# Initialize Git
git init

# Add the remote repository
git remote add origin https://github.com/mhaack/sewing-tracker.git
```

### 2. Configure Git (if not already done)

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"
```

### 3. Stage All Files

```bash
# Add all files to staging
git add .

# Check what will be committed
git status
```

### 4. Create Initial Commit

```bash
# Commit with a descriptive message
git commit -m "Initial commit: Sewing Tracker with Lit and Supabase

- Complete Lit-based frontend with Web Components
- Supabase integration for data persistence
- Project management features (create, edit, delete)
- Stats tracking (cost, fabric, time)
- Sorting and filtering capabilities
- Responsive design for mobile, tablet, and desktop
- Netlify deployment configuration
- German sample data"
```

### 5. Push to GitHub

```bash
# Push to the main branch
git push -u origin main

# If using 'master' instead of 'main', use:
# git push -u origin master
```

## Daily Workflow

### Making Changes

```bash
# Check current status
git status

# Stage specific files
git add path/to/file

# Or stage all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

### Creating a New Feature

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Make your changes, then commit
git add .
git commit -m "Add new feature"

# Push the branch
git push -u origin feature/your-feature-name

# Create a Pull Request on GitHub to merge into main
```

## Useful Git Commands

### Check Status
```bash
git status                  # Show working tree status
git log --oneline          # Show commit history
git diff                   # Show unstaged changes
```

### Branching
```bash
git branch                 # List branches
git checkout -b new-branch # Create and switch to new branch
git checkout main          # Switch to main branch
git branch -d branch-name  # Delete a branch
```

### Undoing Changes
```bash
git restore file.txt       # Discard changes in working directory
git reset HEAD file.txt    # Unstage a file
git commit --amend         # Modify the last commit
```

### Syncing with Remote
```bash
git fetch                  # Download changes from remote
git pull                   # Fetch and merge changes
git push                   # Upload local commits
```

## GitHub Authentication

If prompted for credentials when pushing:

### Option 1: Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use the token as your password when prompted

### Option 2: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add SSH key to GitHub (copy the public key)
cat ~/.ssh/id_ed25519.pub

# Change remote URL to use SSH
git remote set-url origin git@github.com:mhaack/sewing-tracker.git
```

## Troubleshooting

### Problem: "fatal: not a git repository"
**Solution**: Run `git init` in your project directory

### Problem: "Updates were rejected because the remote contains work"
**Solution**: 
```bash
git pull --rebase origin main
git push
```

### Problem: Large files won't push
**Solution**: Add them to `.gitignore` or use Git LFS
```bash
# Add to .gitignore
echo "large-file.zip" >> .gitignore
git rm --cached large-file.zip
git commit -m "Remove large file"
```

## .gitignore

The `.gitignore` file is already configured to exclude:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.env*` - Environment variables (keep secrets safe!)
- `.DS_Store` - macOS files
- Editor and cache directories

## Next Steps

After pushing to GitHub:

1. ✅ Set up automatic deployments on Netlify (see `DEPLOYMENT.md`)
2. ✅ Configure branch protection rules on GitHub
3. ✅ Add repository description and topics on GitHub
4. ✅ Consider adding GitHub Actions for CI/CD

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
