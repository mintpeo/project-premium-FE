# Script để chạy React Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING REACT FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra node_modules
if (-Not (Test-Path "node_modules")) {
    Write-Host "[1/2] Đang cài đặt dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
} else {
    Write-Host "[1/2] Dependencies đã được cài đặt" -ForegroundColor Green
    Write-Host ""
}

Write-Host "[2/2] Đang khởi động React development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend sẽ chạy tại: http://localhost:5173" -ForegroundColor Green
Write-Host "Nhấn Ctrl+C để dừng server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Chạy development server
npm run dev
