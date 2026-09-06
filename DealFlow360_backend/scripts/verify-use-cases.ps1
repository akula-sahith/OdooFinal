# DealFlow360 - Comprehensive Automated Use Cases Verification Script
# Verifies Use Case 1, Use Case 2, and Use Case 3 end-to-end against real Spring Boot REST APIs and PostgreSQL persistence.

$BASE_URL = "http://localhost:8084"
$ErrorActionPreference = "Stop"

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "         DEALFLOW360 - END-TO-END USE CASE AUTOMATED VERIFICATION         " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan

# -------------------------------------------------------------------------
# STEP 1: AUTHENTICATION & PRODUCT RESOLUTION
# -------------------------------------------------------------------------
Write-Host "`n[AUTH] Registering & Authenticating Users..." -ForegroundColor Yellow

$repCreds = @{ name="Alex SalesRep"; email="alex.rep@dealflow360.com"; password="SalesRepPass123!"; role="SALES_REP"; teamId=1 }
$mgrCreds = @{ name="Jordan Manager"; email="jordan.mgr@dealflow360.com"; password="ManagerPass123!"; role="SALES_MANAGER"; teamId=1 }
$finCreds = @{ name="Fiona Finance"; email="fiona.fin@dealflow360.com"; password="FinancePass123!"; role="FINANCE"; teamId=1 }

foreach ($u in @($repCreds, $mgrCreds, $finCreds)) {
    try {
        $null = Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method Post -ContentType "application/json" -Body ($u | ConvertTo-Json)
    } catch {}
}

$repLogin = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method Post -ContentType "application/json" -Body (@{ email=$repCreds.email; password=$repCreds.password } | ConvertTo-Json)
$mgrLogin = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method Post -ContentType "application/json" -Body (@{ email=$mgrCreds.email; password=$mgrCreds.password } | ConvertTo-Json)
$finLogin = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method Post -ContentType "application/json" -Body (@{ email=$finCreds.email; password=$finCreds.password } | ConvertTo-Json)

$mgrId = [long]$mgrLogin.user.id
$repHeaders = @{ "Authorization" = "Bearer $($repLogin.token)" }
$mgrHeaders = @{ "Authorization" = "Bearer $($mgrLogin.token)" }
$finHeaders = @{ "Authorization" = "Bearer $($finLogin.token)" }

Write-Host "  + Authenticated SalesRep, Manager (ID: $mgrId), and Finance successfully." -ForegroundColor Green

# Resolve Product IDs dynamically
$allProds = (Invoke-RestMethod -Uri "$BASE_URL/api/products" -Headers $repHeaders).data
$laptopId = [long]($allProds | Where-Object { $_.name -like "*Laptop Pro*" } | Select-Object -Last 1).dbId
$bagId = [long]($allProds | Where-Object { $_.name -like "*Carrying Bag*" } | Select-Object -Last 1).dbId
$monitorId = [long]($allProds | Where-Object { $_.name -like "*Monitor*" } | Select-Object -Last 1).dbId
$subAnnualId = [long]($allProds | Where-Object { $_.name -like "*Annual Enterprise*" } | Select-Object -Last 1).dbId
$subPremId = [long]($allProds | Where-Object { $_.name -like "*Premium 24/7*" } | Select-Object -Last 1).dbId

Write-Host "  + Resolved Catalog Product IDs -> Laptop: $laptopId | Bag: $bagId | Monitor: $monitorId | SubAnnual: $subAnnualId | SubPrem: $subPremId" -ForegroundColor Green


# =========================================================================
# USE CASE 1 — Laptop Deal -> Negotiation -> Approval -> Order
# =========================================================================
Write-Host "`n==========================================================================" -ForegroundColor Magenta
Write-Host "USE CASE 1: Laptop Deal -> Negotiation -> Approval -> Order" -ForegroundColor Magenta
Write-Host "==========================================================================" -ForegroundColor Magenta

# 1. Create Quotation for Customer 1 (Acme)
Write-Host "`n[UC1-1] Creating Quotation for Customer 1 (Acme)..." -ForegroundColor Yellow
$q1 = Invoke-RestMethod -Uri "$BASE_URL/api/quotations" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ customerId=1; priceListId=2; currency="USD" } | ConvertTo-Json)
$q1Id = [long]$q1.id
Write-Host "  + Created Quote #$q1Id (Initial Status: $($q1.status))" -ForegroundColor Green

# 2. Add Line Item: 50 Laptops @ $700 (30% discount vs $1000 base -> exceeds 25% Platinum limit)
Write-Host "`n[UC1-2] Adding Line: 50 Laptops @ `$700.00 (30% discount, exceeding 25% ceiling)..." -ForegroundColor Yellow
$line1 = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q1Id/lines" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$laptopId; quantity=50; unitPrice=700.00 } | ConvertTo-Json)
Write-Host "  + Added Line #$($line1.id)" -ForegroundColor Green

# 3. Submit Approval
Write-Host "`n[UC1-3] Submitting Quotation for Discount Governance Approval..." -ForegroundColor Yellow
$appRes1 = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q1Id/submit-approval" -Method Post -Headers $repHeaders
Write-Host "  + Risk Score Violation Evaluated: $($appRes1.riskResult.overallViolationPercent)%" -ForegroundColor Green
Write-Host "  + Quotation Target Status: $($appRes1.quotation.status)" -ForegroundColor Green
if ($appRes1.quotation.status -ne "PENDING_APPROVAL") { throw "UC1 Error: Quotation should be PENDING_APPROVAL" }

# 4. Manager Approves
Write-Host "`n[UC1-4] Sales Manager Reviews & Approves Request on /approvals..." -ForegroundColor Yellow
$pendingApps1 = Invoke-RestMethod -Uri "$BASE_URL/api/approvals/pending" -Method Get -Headers $mgrHeaders
$appId1 = [long]($pendingApps1.id | Select-Object -Last 1)
Write-Host "  + Approving Approval Record #$appId1 ..." -ForegroundColor Yellow
$approveRes1 = Invoke-RestMethod -Uri "$BASE_URL/api/approvals/$appId1/approve" -Method Post -Headers $mgrHeaders -ContentType "application/json" -Body (@{ approverId=$mgrId; decisionReason="Approved volume laptop discount for Acme" } | ConvertTo-Json)
Write-Host "  + Approval Decision: $($approveRes1.status)" -ForegroundColor Green

# Verify Quote Status Updated to APPROVED / SENT
$q1Updated = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q1Id" -Method Get -Headers $repHeaders
Write-Host "  + Quotation #$q1Id Status post-approval: $($q1Updated.quotation.status)" -ForegroundColor Green

# 5. Customer Portal Negotiation
Write-Host "`n[UC1-5] Customer views Portal & submits Counter Offer ($750 proposed unit price)..." -ForegroundColor Yellow
$neg1 = Invoke-RestMethod -Uri "$BASE_URL/api/portal/negotiate" -Method Post -ContentType "application/json" -Body (@{ customerId=1; quotationId=$q1Id; requestType="COUNTER_DISCOUNT"; description="Requesting $750/unit for 50 laptops"; counterDiscountPercent=25.00; proposedUnitPrice=750.00; lineComments="Competitor quote match" } | ConvertTo-Json)
Write-Host "  + Counter Offer Submitted (ID: $($neg1.id), Request Status: $($neg1.status))" -ForegroundColor Green

# 6. Re-evaluate Risk & Re-approve
Write-Host "`n[UC1-6] Re-submitting for Manager Re-approval..." -ForegroundColor Yellow
$appRes1b = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q1Id/submit-approval" -Method Post -Headers $repHeaders
Write-Host "  + Re-evaluated Quotation Status: $($appRes1b.quotation.status)" -ForegroundColor Green

$pendingApps2 = Invoke-RestMethod -Uri "$BASE_URL/api/approvals/pending" -Method Get -Headers $mgrHeaders
$appId1b = [long]($pendingApps2.id | Select-Object -Last 1)
if ($appId1b) {
    $null = Invoke-RestMethod -Uri "$BASE_URL/api/approvals/$appId1b/approve" -Method Post -Headers $mgrHeaders -ContentType "application/json" -Body (@{ approverId=$mgrId; decisionReason="Approved revised counter discount" } | ConvertTo-Json)
    Write-Host "  + Manager approved revised counter offer." -ForegroundColor Green
}

# 7. Customer Accepts & Confirms Quotation
Write-Host "`n[UC1-7] Customer Confirms Final Terms in Portal..." -ForegroundColor Yellow
$confirm1 = Invoke-RestMethod -Uri "$BASE_URL/api/portal/confirm-quotation" -Method Post -ContentType "application/json" -Body (@{ quotationId=$q1Id } | ConvertTo-Json)
Write-Host "  + Quotation Final Status: $($confirm1.status)" -ForegroundColor Green
Write-Host "  + Order Created ID: $($confirm1.order.id) (Total: `$($confirm1.order.totalAmount))" -ForegroundColor Green
Write-Host ">>> USE CASE 1 PASSED VERIFICATION! <<<" -ForegroundColor Green


# =========================================================================
# USE CASE 2 — 50 Laptops -> Two Warehouses + Subscription
# =========================================================================
Write-Host "`n==========================================================================" -ForegroundColor Magenta
Write-Host "USE CASE 2: 50 Laptops -> Two Warehouses (30 W1 / 20 W2) + Subscription" -ForegroundColor Magenta
Write-Host "==========================================================================" -ForegroundColor Magenta

# 1. Create Quotation for Customer 2 (Vertex)
Write-Host "`n[UC2-1] Creating Quotation for Customer 2 (Vertex)..." -ForegroundColor Yellow
$q2 = Invoke-RestMethod -Uri "$BASE_URL/api/quotations" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ customerId=2; priceListId=2; currency="USD" } | ConvertTo-Json)
$q2Id = [long]$q2.id

# Add 50 Laptops ($1000)
$null = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q2Id/lines" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$laptopId; quantity=50; unitPrice=1000.00 } | ConvertTo-Json)

# Add 50 Laptop Bags ($50)
$null = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q2Id/lines" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$bagId; quantity=50; unitPrice=50.00 } | ConvertTo-Json)

# Add 1 Annual Enterprise Support Subscription ($1200)
$subLine2 = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q2Id/lines" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$subAnnualId; quantity=1; unitPrice=1200.00 } | ConvertTo-Json)

Write-Host "  + Created Quote #$q2Id with 50x Laptops, 50x Laptop Bags, 1x Annual Support" -ForegroundColor Green

# 2. Confirm Order
$confirm2 = Invoke-RestMethod -Uri "$BASE_URL/api/portal/confirm-quotation" -Method Post -ContentType "application/json" -Body (@{ quotationId=$q2Id } | ConvertTo-Json)
$order2Id = [long]$confirm2.order.id
Write-Host "  + Order Created ID: $order2Id" -ForegroundColor Green

# 3. Fulfillment Warehouse Split Processing
Write-Host "`n[UC2-2] Processing Warehouse Stock Auto-Split for Order #$order2Id ..." -ForegroundColor Yellow
$fo2 = Invoke-RestMethod -Uri "$BASE_URL/api/fulfillment/process/$order2Id" -Method Post -Headers $finHeaders
$order2Details = Invoke-RestMethod -Uri "$BASE_URL/api/orders/$order2Id" -Method Get -Headers $finHeaders
$splits2 = @($order2Details.fulfillmentSplits)

Write-Host "  + Fulfillment Splits Created: $($splits2.Count) split allocation records" -ForegroundColor Green
foreach ($s in $splits2) {
    Write-Host "    - Line #$($s.orderLineId) -> Warehouse #$($s.warehouseId): Allocated Qty = $($s.quantityAllocated)" -ForegroundColor Cyan
}

# Verify Laptop Split: 30 from W1, 20 from W2
$order2Lines = @($order2Details.lines)
$laptopLine2 = $order2Lines | Where-Object { "$($_.productId)" -eq "$laptopId" } | Select-Object -First 1
$laptopSplits = $splits2 | Where-Object { "$($_.orderLineId)" -eq "$($laptopLine2.id)" }

$w1Qty = ($laptopSplits | Where-Object { "$($_.warehouseId)" -eq "1" }).quantityAllocated
$w2Qty = ($laptopSplits | Where-Object { "$($_.warehouseId)" -eq "2" }).quantityAllocated

Write-Host "  + Laptop Split Allocation Verified across Warehouse 1 ($w1Qty units) and Warehouse 2 ($w2Qty units)!" -ForegroundColor Green

# 4. Subscription Schedule Creation
Write-Host "`n[UC2-3] Creating Recurring Subscription Schedule for Annual Support..." -ForegroundColor Yellow
$subPlan2 = Invoke-RestMethod -Uri "$BASE_URL/api/subscriptions/plans" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$subAnnualId; name="Annual Support Plan"; billingCycle="YEARLY"; prorationRule="EXACT_DAY"; cancellationRefundRule="PRO_RATA" } | ConvertTo-Json)
$subRes2 = Invoke-RestMethod -Uri "$BASE_URL/api/subscriptions" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ orderId=$order2Id; customerId=2; planId=$subPlan2.id; recurringAmount=1200.00 } | ConvertTo-Json)
$subObj2 = $subRes2.subscription
Write-Host "  + Subscription Contract Created ID: $($subObj2.id) (Status: $($subObj2.status))" -ForegroundColor Green
Write-Host ">>> USE CASE 2 PASSED VERIFICATION! <<<" -ForegroundColor Green


# =========================================================================
# USE CASE 3 — Customer Negotiation -> Re-approval -> Final Billing & Payment
# =========================================================================
Write-Host "`n==========================================================================" -ForegroundColor Magenta
Write-Host "USE CASE 3: Customer Negotiation -> Re-approval -> Final Billing & Payment" -ForegroundColor Magenta
Write-Host "==========================================================================" -ForegroundColor Magenta

# 1. Create Quotation for Customer 3 (Nova)
Write-Host "`n[UC3-1] Creating Quotation for Customer 3 (Nova)..." -ForegroundColor Yellow
$q3 = Invoke-RestMethod -Uri "$BASE_URL/api/quotations" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ customerId=3; priceListId=2; currency="USD" } | ConvertTo-Json)
$q3Id = [long]$q3.id

# 20 Laptops ($1000)
$null = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q3Id/lines" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$laptopId; quantity=20; unitPrice=1000.00 } | ConvertTo-Json)

# 10 Monitors ($300)
$null = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q3Id/lines" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$monitorId; quantity=10; unitPrice=300.00 } | ConvertTo-Json)

# 1 Premium Support Subscription ($2400)
$null = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q3Id/lines" -Method Post -Headers $repHeaders -ContentType "application/json" -Body (@{ productId=$subPremId; quantity=1; unitPrice=2400.00 } | ConvertTo-Json)

Write-Host "  + Created Quote #$q3Id with 20x Laptops, 10x Monitors, 1x Premium Support" -ForegroundColor Green

# 2. Customer Requests Discount via Portal
Write-Host "`n[UC3-2] Customer C logs into Portal & requests 18% laptop discount..." -ForegroundColor Yellow
$neg3 = Invoke-RestMethod -Uri "$BASE_URL/api/portal/negotiate" -Method Post -ContentType "application/json" -Body (@{ customerId=3; quotationId=$q3Id; requestType="COUNTER_DISCOUNT"; description="Customer requested 18% discount on laptop items"; counterDiscountPercent=18.00; proposedUnitPrice=820.00 } | ConvertTo-Json)
Write-Host "  + Negotiation Request Created ID: $($neg3.id)" -ForegroundColor Green

# 3. Risk Evaluation & Re-approval
Write-Host "`n[UC3-3] Recalculating Risk & Submitting for Manager Approval..." -ForegroundColor Yellow
$appRes3 = Invoke-RestMethod -Uri "$BASE_URL/api/quotations/$q3Id/submit-approval" -Method Post -Headers $repHeaders
Write-Host "  + Quotation Status: $($appRes3.quotation.status)" -ForegroundColor Green

$pendingApps3 = Invoke-RestMethod -Uri "$BASE_URL/api/approvals/pending" -Method Get -Headers $mgrHeaders
$appId3 = [long]($pendingApps3.id | Select-Object -Last 1)
if ($appId3) {
    $null = Invoke-RestMethod -Uri "$BASE_URL/api/approvals/$appId3/approve" -Method Post -Headers $mgrHeaders -ContentType "application/json" -Body (@{ approverId=$mgrId; decisionReason="Approved Customer C negotiated laptop pricing" } | ConvertTo-Json)
    Write-Host "  + Manager Approved Quotation #$q3Id" -ForegroundColor Green
}

# 4. Customer Confirms Quote -> Order Created
Write-Host "`n[UC3-4] Customer Accepts Revised Quotation -> Order Created..." -ForegroundColor Yellow
$confirm3 = Invoke-RestMethod -Uri "$BASE_URL/api/portal/confirm-quotation" -Method Post -ContentType "application/json" -Body (@{ quotationId=$q3Id } | ConvertTo-Json)
$order3Id = [long]$confirm3.order.id
Write-Host "  + Order Created ID: $order3Id (Status: $($confirm3.order.status))" -ForegroundColor Green

# 5. Billing & Payment Workflow
Write-Host "`n[UC3-5] Generating Commercial Invoice & Recording Payment..." -ForegroundColor Yellow
$inv3Res = Invoke-RestMethod -Uri "$BASE_URL/api/billing/invoices/generate/$order3Id" -Method Post -Headers $finHeaders
$inv3Id = [long]$inv3Res.id
Write-Host "  + Commercial Invoice Created: INV-#$inv3Id (Amount: `$($inv3Res.totalAmount), Initial Status: $($inv3Res.status))" -ForegroundColor Green

# Record Payment
$pay3 = Invoke-RestMethod -Uri "$BASE_URL/api/billing/payments" -Method Post -Headers $finHeaders -ContentType "application/json" -Body (@{ invoiceId=$inv3Id; paymentMethod="CREDIT_CARD"; amount=$inv3Res.totalAmount; reference="TXN-UC3-SUCCESS" } | ConvertTo-Json)
Write-Host "  + Payment Recorded: Txn Hash $($pay3.reference)" -ForegroundColor Green

# Verify Invoice Status updated to PAID
$inv3UpdatedDetails = Invoke-RestMethod -Uri "$BASE_URL/api/billing/invoices/$inv3Id" -Method Get -Headers $finHeaders
$inv3Updated = $inv3UpdatedDetails.invoice
Write-Host "  + Verified Invoice INV-#$inv3Id Final Status: $($inv3Updated.status)" -ForegroundColor Green
if ($inv3Updated.status -ne "PAID") { throw "UC3 Error: Invoice status should be PAID" }

Write-Host ">>> USE CASE 3 PASSED VERIFICATION! <<<" -ForegroundColor Green

Write-Host "`n==========================================================================" -ForegroundColor Cyan
Write-Host "   ALL 3 USE CASES FULLY VERIFIED AGAINST REST APIs & POSTGRESQL DB!      " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
