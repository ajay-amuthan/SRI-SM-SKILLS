# Sri SM Skills — One-Click Deploy Script
# Run in Command Prompt: deploy.cmd

@echo off
echo ========================================
echo   Sri SM Skills - Production Deploy
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Checking Vercel login...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo Please login to Vercel in your browser when prompted...
    vercel login
)

echo.
echo [2/5] Checking GitHub login...
gh auth status >nul 2>&1
if errorlevel 1 (
    echo.
    echo Please login to GitHub in your browser when prompted...
    gh auth login -w -p https
)

echo.
echo [3/5] Creating GitHub repo and pushing code...
gh repo create sri-sm-skills --public --source=. --remote=origin --push 2>nul
if errorlevel 1 (
    git remote add origin https://github.com/%USERNAME%/sri-sm-skills.git 2>nul
    git branch -M main
    git push -u origin main 2>nul
)

echo.
echo [4/5] Deploying to Vercel...
echo.
echo IMPORTANT: When prompted, add these environment variables:
echo   DATABASE_URL     = Your Neon PostgreSQL connection string
echo   AUTH_SECRET      = Run: openssl rand -base64 32
echo   AUTH_URL         = Your Vercel URL (update after first deploy)
echo   RAZORPAY_KEY_ID  = Your Razorpay live key
echo   RAZORPAY_KEY_SECRET = Your Razorpay live secret
echo   NEXT_PUBLIC_WHATSAPP_NUMBER = 919876543210
echo.
vercel --prod

echo.
echo [5/5] Seed production database (run once after setting DATABASE_URL):
echo   set DATABASE_URL=your-neon-connection-string
echo   npm run db:seed
echo.
echo ========================================
echo   Deploy complete! Visit your Vercel URL
echo   Admin: /login
echo   Email: admin@srismskills.com / admin123
echo ========================================
pause
