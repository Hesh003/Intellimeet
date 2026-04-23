$ErrorActionPreference = "Stop"

Write-Host "Creating backend..."
mkdir backend
Set-Location backend
npm init -y
npm install express mongoose bcrypt jsonwebtoken cors dotenv
npm install -D typescript @types/express @types/mongoose @types/bcrypt @types/jsonwebtoken @types/cors @types/node ts-node-dev
npx tsc --init

Set-Location ..

Write-Host "Creating mobile..."
npx -yes create-expo-app@latest mobile --template tabs
