# Setting Up Git with a Different GitHub Account

## Step 1: Configure Git for This Project

You can configure git to use different credentials for this specific repository:

```bash
# Set local git config for this repository only
git config user.name "Your GitHub Username"
git config user.email "your-email@example.com"
```

## Step 2: Initialize Git Repository (if not already done)

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: How Academia LMS"
```

## Step 3: Create GitHub Repository

1. Go to GitHub.com and **log in with your desired account**
2. Click the "+" icon → "New repository"
3. Name it: `how-academia` (or any name you prefer)
4. **Don't** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 4: Connect Local Repository to GitHub

```bash
# Add the remote (replace with your GitHub username and repo name)
git remote add origin https://github.com/YOUR-USERNAME/how-academia.git

# Or if using SSH (if you have SSH keys set up)
git remote add origin git@github.com:YOUR-USERNAME/how-academia.git
```

## Step 5: Authenticate with GitHub

### Option A: Using Personal Access Token (Recommended)

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Vercel Deployment")
4. Select scopes: `repo` (all repo permissions)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

When you push, use the token as your password:
```bash
git push -u origin main
# Username: your-github-username
# Password: paste-your-personal-access-token
```

### Option B: Using GitHub CLI

```bash
# Install GitHub CLI (if not installed)
winget install GitHub.cli

# Authenticate
gh auth login

# Then push
git push -u origin main
```

### Option C: Using SSH Keys

1. Generate SSH key (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

2. Add SSH key to GitHub:
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste the key and save

3. Use SSH URL for remote:
```bash
git remote set-url origin git@github.com:YOUR-USERNAME/how-academia.git
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Step 7: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. **Sign in with the same GitHub account** you used for the repository
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect Next.js
6. Click "Deploy"

## Troubleshooting

### If you get authentication errors:
- Make sure you're logged into the correct GitHub account
- Use a Personal Access Token instead of password
- Check that your git remote URL matches your GitHub account

### To remove existing remote:
```bash
git remote remove origin
```

### To check current configuration:
```bash
git config user.name
git config user.email
git remote -v
```

