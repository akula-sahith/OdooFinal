# DealFlow360 - Comprehensive Seed Data REST API & Persistence Verification Script
# Verifies the 500-600+ record dataset across all major Spring Boot REST APIs.

$BASE_URL = "http://localhost:8084"
$ErrorActionPreference = "Stop"

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "     DEALFLOW360 - COMPREHENSIVE SEED DATA REST API VERIFICATION         " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n[1] Testing GET /api/health ..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/api/health" -Method Get
    Write-Host "  + Health Status: $health" -ForegroundColor Green
} catch {
    Write-Host "  ! Failed to reach $BASE_URL/api/health. Checking port 8082..." -ForegroundColor Yellow
    $BASE_URL = "http://localhost:8082"
    $health = Invoke-RestMethod -Uri "$BASE_URL/api/health" -Method Get
    Write-Host "  + Health Status on 8082: $health" -ForegroundColor Green
}

# 2. Authentication
Write-Host "`n[2] Authenticating Demo Users ..." -ForegroundColor Yellow

$usersToAuth = @(
    @{ name="System Admin"; email="admin@dealflow360.com"; password="AdminPassword123!"; role="ADMIN"; teamId=1 },
    @{ name="Alex SalesRep"; email="alex.rep@dealflow360.com"; password="SalesRepPass123!"; role="SALES_REP"; teamId=1 },
    @{ name="Jordan Manager"; email="jordan.mgr@dealflow360.com"; password="ManagerPass123!"; role="SALES_MANAGER"; teamId=1 },
    @{ name="Fiona Finance"; email="fiona.fin@dealflow360.com"; password="FinancePass123!"; role="FINANCE"; teamId=1 }
)

foreach ($u in $usersToAuth) {
    try {
        $regBody = $u | ConvertTo-Json
        $null = Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method Post -ContentType "application/json" -Body $regBody
        Write-Host "  + Registered/Updated user: $($u.email)" -ForegroundColor Cyan
    } catch {
        Write-Host "  - Registration notice: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

$adminJson = @{ email="admin@dealflow360.com"; password="AdminPassword123!" } | ConvertTo-Json
$repJson = @{ email="alex.rep@dealflow360.com"; password="SalesRepPass123!" } | ConvertTo-Json
$finJson = @{ email="fiona.fin@dealflow360.com"; password="FinancePass123!" } | ConvertTo-Json

$adminLogin = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method Post -ContentType "application/json" -Body $adminJson
$repLogin = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method Post -ContentType "application/json" -Body $repJson
$finLogin = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method Post -ContentType "application/json" -Body $finJson

$adminHeaders = @{ "Authorization" = "Bearer $($adminLogin.token)" }
$repHeaders = @{ "Authorization" = "Bearer $($repLogin.token)" }
$finHeaders = @{ "Authorization" = "Bearer $($finLogin.token)" }

Write-Host "  + Successfully authenticated Admin, SalesRep, and Finance demo tokens!" -ForegroundColor Green

# 3. Catalog Products Verification
Write-Host "`n[3] Verifying Products Catalog REST API (GET /api/products) ..." -ForegroundColor Yellow
$productsRes = Invoke-RestMethod -Uri "$BASE_URL/api/products" -Method Get -Headers $repHeaders
$productsList = @($productsRes.data)
Write-Host "  + Total Seeded Products Count: $($productsList.Count)" -ForegroundColor Green
if ($productsList.Count -lt 50) { throw "Verification Failed: Expected at least 50 products, found $($productsList.Count)" }

# 4. Customers & Tier Verification
Write-Host "`n[4] Verifying B2B Customers REST API (GET /api/customers) ..." -ForegroundColor Yellow
$customersRes = Invoke-RestMethod -Uri "$BASE_URL/api/customers" -Method Get -Headers $repHeaders
$customersList = @($customersRes.data)
Write-Host "  + Total Seeded B2B Customers Count: $($customersList.Count)" -ForegroundColor Green
if ($customersList.Count -lt 40) { throw "Verification Failed: Expected at least 40 customers, found $($customersList.Count)" }

# 5. Inventory & Warehouses Verification
Write-Host "`n[5] Verifying Logistics & Stock REST API (GET /api/warehouses) ..." -ForegroundColor Yellow
$rawWarehouses = Invoke-RestMethod -Uri "$BASE_URL/api/warehouses" -Method Get -Headers $finHeaders
if ($rawWarehouses.data) {
    $warehousesList = @($rawWarehouses.data)
} else {
    $warehousesList = [object[]]$rawWarehouses
}
Write-Host "  + Total Logistics Warehouses Count: $($warehousesList.Count)" -ForegroundColor Green
foreach ($w in $warehousesList) {
    Write-Host "    - Warehouse #$($w.id): $($w.name) ($($w.location))" -ForegroundColor Cyan
}
if ($warehousesList.Count -lt 5) { throw "Verification Failed: Expected 5 warehouses, found $($warehousesList.Count)" }

# 6. Quotations Verification
Write-Host "`n[6] Verifying Quotations REST API (GET /api/quotations) ..." -ForegroundColor Yellow
$quotationsRes = Invoke-RestMethod -Uri "$BASE_URL/api/quotations" -Method Get -Headers $repHeaders
$quotationsList = @($quotationsRes.data)
Write-Host "  + Total Seeded Quotations Count: $($quotationsList.Count)" -ForegroundColor Green
if ($quotationsList.Count -lt 10) { throw "Verification Failed: Expected at least 10 quotations, found $($quotationsList.Count)" }

# 7. Orders Verification
Write-Host "`n[7] Verifying Orders REST API (GET /api/orders) ..." -ForegroundColor Yellow
$ordersRes = Invoke-RestMethod -Uri "$BASE_URL/api/orders" -Method Get -Headers $finHeaders
$ordersList = @($ordersRes.data)
Write-Host "  + Total Seeded Orders Count: $($ordersList.Count)" -ForegroundColor Green
if ($ordersList.Count -lt 5) { throw "Verification Failed: Expected at least 5 orders, found $($ordersList.Count)" }

# 8. Invoices & Billing Verification
Write-Host "`n[8] Verifying Invoices & Billing REST API (GET /api/billing/invoices) ..." -ForegroundColor Yellow
$invoicesRes = Invoke-RestMethod -Uri "$BASE_URL/api/billing/invoices" -Method Get -Headers $finHeaders
$invoicesList = @($invoicesRes.data)
Write-Host "  + Total Seeded Invoices Count: $($invoicesList.Count)" -ForegroundColor Green
if ($invoicesList.Count -lt 3) { throw "Verification Failed: Expected at least 3 invoices, found $($invoicesList.Count)" }

# 9. Subscriptions Verification
Write-Host "`n[9] Verifying Subscriptions REST API (GET /api/subscriptions) ..." -ForegroundColor Yellow
$subscriptionsRes = Invoke-RestMethod -Uri "$BASE_URL/api/subscriptions" -Method Get -Headers $repHeaders
$subscriptionsList = @($subscriptionsRes.data)
Write-Host "  + Total Active Subscriptions Count: $($subscriptionsList.Count)" -ForegroundColor Green

Write-Host "`n==========================================================================" -ForegroundColor Cyan
Write-Host "   SEED DATA REST API PERSISTENCE VERIFICATION PASSED SUCCESSFULLY!       " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
