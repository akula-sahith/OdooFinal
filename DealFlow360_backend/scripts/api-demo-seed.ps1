# DealFlow360 API Seed & Real HTTP Execution Script

$BASE_URL = "http://localhost:8082"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Starting DealFlow360 API Execution & Seed Script" -ForegroundColor Cyan
Write-Host "Base URL: $BASE_URL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n[1] Testing GET /api/health ..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/api/health" -Method Get
    Write-Host "Health Status: $health" -ForegroundColor Green
} catch {
    Write-Host "Health check failed: $_" -ForegroundColor Red
}

# 2. Authentication & User Registration
Write-Host "`n[2] Registering & Authenticating Users ..." -ForegroundColor Yellow

$users = @(
    @{ name="System Admin"; email="admin@dealflow360.com"; password="AdminPassword123!"; role="ADMIN"; teamId=1 },
    @{ name="Alex SalesRep"; email="alex.rep@dealflow360.com"; password="SalesRepPass123!"; role="SALES_REP"; teamId=1 },
    @{ name="Jordan Manager"; email="jordan.mgr@dealflow360.com"; password="ManagerPass123!"; role="SALES_MANAGER"; teamId=1 },
    @{ name="Fiona Finance"; email="fiona.fin@dealflow360.com"; password="FinancePass123!"; role="FINANCE"; teamId=1 }
)

foreach ($u in $users) {
    try {
        $regBody = $u | ConvertTo-Json
        $null = Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method Post -ContentType "application/json" -Body $regBody
        Write-Host "  + Registered user: $($u.email) ($($u.role))" -ForegroundColor Green
    } catch {
        Write-Host "  - Registration info: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

# Login Sales Rep
$loginRep = @{ email="alex.rep@dealflow360.com"; password="SalesRepPass123!" } | ConvertTo-Json
$repAuth = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method Post -ContentType "application/json" -Body $loginRep
$salesRepToken = $repAuth.token
Write-Host "  + Sales Rep Token: ${salesRepToken}" -ForegroundColor Green

# 3. Quotation Creation
Write-Host "`n[3] Creating Quotation via POST /api/quotations ..." -ForegroundColor Yellow
$quoteReq = @{ customerId = 1; priceListId = 1; currency = "USD" } | ConvertTo-Json
$headers = @{ "Authorization" = "Bearer $salesRepToken" }
$quotation = Invoke-RestMethod -Uri "$BASE_URL/api/quotations" -Method Post -Headers $headers -ContentType "application/json" -Body $quoteReq
$quotationId = $quotation.id
Write-Host "  + Quotation Created ID: $quotationId (Status: $($quotation.status))" -ForegroundColor Green

# Add Quotation Line
$lineReq = @{ productId = 1; productVariantId = 1; quantity = 10; unitPrice = 1000.00 } | ConvertTo-Json
$lineRes = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$quotationId/lines" -Method Post -Headers $headers -ContentType "application/json" -Body $lineReq
Write-Host "  + Quotation Line Added ID: $($lineRes.id) (Total: $($lineRes.totalAmount))" -ForegroundColor Green

# Submit Approval
Write-Host "`n[4] Submitting Quotation Approval via POST /api/quotations/$quotationId/submit-approval ..." -ForegroundColor Yellow
$appResult = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$quotationId/submit-approval" -Method Post -Headers $headers
Write-Host "  + Approval Status: $($appResult.quotation.status)" -ForegroundColor Green

# 4. Customer Portal Negotiation
Write-Host "`n[5] Submitting Customer Portal Counter Offer via POST /api/portal/negotiate ..." -ForegroundColor Yellow
$negReq = @{
    customerId = 1
    quotationId = $quotationId
    requestType = "COUNTER_DISCOUNT"
    description = "Customer requested 10% volume discount"
    counterDiscountPercent = 10.00
    proposedUnitPrice = 900.00
    lineComments = "Matched annual competitor rate"
} | ConvertTo-Json
$negRes = Invoke-RestMethod -Uri "$BASE_URL/api/portal/negotiate" -Method Post -ContentType "application/json" -Body $negReq
Write-Host "  + Negotiation Created ID: $($negRes.id) (Status: $($negRes.status))" -ForegroundColor Green

# 5. Order Confirmation
Write-Host "`n[6] Confirming Quotation & Creating Order via POST /api/portal/confirm-quotation ..." -ForegroundColor Yellow
$confirmReq = @{ quotationId = $quotationId } | ConvertTo-Json
$confirmRes = Invoke-RestMethod -Uri "$BASE_URL/api/portal/confirm-quotation" -Method Post -ContentType "application/json" -Body $confirmReq
$orderId = $confirmRes.order.id
Write-Host "  + Order Created ID: $orderId (Status: $($confirmRes.order.status))" -ForegroundColor Green

# 6. Subscription Management
Write-Host "`n[7] Managing Subscriptions via POST /api/subscriptions ..." -ForegroundColor Yellow
$planReq = @{
    productId = 1
    name = "Enterprise SaaS Monthly Plan"
    billingCycle = "MONTHLY"
    prorationRule = "EXACT_DAY"
    cancellationRefundRule = "PRO_RATA"
} | ConvertTo-Json
$planRes = Invoke-RestMethod -Uri "$BASE_URL/api/subscriptions/plans" -Method Post -Headers $headers -ContentType "application/json" -Body $planReq
$planId = $planRes.id
Write-Host "  + Subscription Plan Created ID: $planId" -ForegroundColor Green

$subReq = @{
    orderId = $orderId
    customerId = 1
    planId = $planId
    recurringAmount = 1500.00
} | ConvertTo-Json
$subRes = Invoke-RestMethod -Uri "$BASE_URL/api/subscriptions" -Method Post -Headers $headers -ContentType "application/json" -Body $subReq
$subscriptionId = $subRes.subscription.id
Write-Host "  + Subscription Created ID: $subscriptionId (Status: $($subRes.subscription.status))" -ForegroundColor Green

# 7. Billing & Payments
Write-Host "`n[8] Generating Invoice & Recording Payments via /api/billing ..." -ForegroundColor Yellow
try {
    $invRes = Invoke-RestMethod -Uri "$BASE_URL/api/billing/invoices/generate/$orderId" -Method Post -Headers $headers
    $invoiceId = $invRes.id
    Write-Host "  + Invoice Generated ID: $invoiceId (Total: $($invRes.totalAmount))" -ForegroundColor Green

    $payReq = @{
        invoiceId = $invoiceId
        paymentMethod = "CREDIT_CARD"
        amount = $invRes.totalAmount
        reference = "TXN-DEMO-8899"
    } | ConvertTo-Json
    $payRes = Invoke-RestMethod -Uri "$BASE_URL/api/billing/payments" -Method Post -Headers $headers -ContentType "application/json" -Body $payReq
    Write-Host "  + Payment Recorded ID: $($payRes.id) Amount: $($payRes.amount) Status: $($payRes.status)" -ForegroundColor Green
} catch {
    Write-Host "  - Billing Info: $($_.Exception.Message)" -ForegroundColor Gray
}

# 8. Deal Health Alerts & Reporting
Write-Host "`n[9] Fetching Deal Health Alerts & Executive Reports ..." -ForegroundColor Yellow
try {
    $alerts = Invoke-RestMethod -Uri "$BASE_URL/api/deal-health/alerts" -Method Get -Headers $headers
    Write-Host "  + Deal Health Alerts Found: $($alerts.Count)" -ForegroundColor Green
} catch {
    Write-Host "  - Alerts Info: $($_.Exception.Message)" -ForegroundColor Gray
}

$report = Invoke-RestMethod -Uri "$BASE_URL/api/reporting/sales-performance" -Method Get -Headers $headers
Write-Host "  + Sales Performance Confirmed Value: $($report.confirmed_value) (Total Quoted: $($report.total_quoted_value))" -ForegroundColor Green

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "API Seed & Execution Completed Successfully!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
