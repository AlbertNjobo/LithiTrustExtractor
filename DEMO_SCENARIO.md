# LithiTrust Demo Scenario - Complete User Journey

## The Story: Grace's Lithium Mining Operation

Grace runs a small-to-medium lithium mine in Harare, Zimbabwe. She has 120 workers, uses water-recycling systems, and practices responsible mining. Now she wants to:
1. Register her first batch on LithiTrust
2. Get verified to earn green premium pricing
3. Attract international buyers

Let's walk through her complete journey on the app.

---

## Phase 1: Registration & ESG Data Entry

### Step 1: Grace Logs In
- **URL:** `https://lithitrust.replit.app/`
- **Action:** Click "Login with Replit"
- **System:** Creates account, assigns her as "Miner" role
- **Result:** Redirected to dashboard (home page)

### Step 2: Grace Navigates to "Register Batch"
- **Dashboard shows:**
  - Total batches: 0
  - Verified batches: 0
  - Average ESG score: N/A
  - Green premium potential: N/A
  
- **Clicks:** "Register Batch" button in sidebar
- **Directed to:** Two-step registration form

### Step 3: Grace Enters Batch Details (Step 1)

**Form Fields - Grace Fills:**

| Field | Grace's Entry | Notes |
|-------|---|---|
| Mine Name | Harare Central Lithium Mine | Her registered operation |
| Mine Location | Harare, Zimbabwe | City coordinates |
| Miner Name | Grace Mutare | Full name |
| Miner Contact | +263 78 123 4567 | Phone number |
| Weight (kg) | 5000 | Total batch weight |
| Grade | Spodumene | Most common Zimbabwe mineral |
| Lithium Content (%) | 2.5 | Assay test result |
| Current Stage | Mining | Batch is still being extracted |

**Progress:** Step 1 of 2 complete ✓

**Grace Clicks:** "Next: ESG Data" button

---

## Phase 2: ESG Compliance Data

### Step 4: Grace Enters ESG Scores (Step 2)

The form explains:
> "Your ESG scores directly determine your green premium pricing (0-30% price increase). Each score measures your practices."

#### Environmental Score Calculation

Grace reviews her water usage:
- Water intake from mine: 150,000 liters/day
- Processing 5,000 kg ore needs: 150,000 L total
- **Water usage per ton: 30,000 L/ton** (with 70% recycling)
- Benchmark: 20,000-50,000 L/ton = Good score
- **Grace assigns:** 75/100 (good water recycling)

Grace reviews carbon footprint:
- Mining equipment: 2 excavators (diesel)
- Diesel used weekly: 1,000 liters
- Processing: Powered by solar (90%), grid (10%)
- **Carbon intensity: ~450 kg CO₂e/ton** (below benchmark)
- **Grace assigns:** 78/100 (efficient operations)

**Environmental Score: 75**

#### Social Score Calculation

Grace confirms:
- ✓ All 120 workers verified age 18+ (government records)
- ✓ Written community agreement with Harare local council
- ✓ 5% of profits go to local water projects
- ✓ Monthly safety meetings, zero fatal accidents in 2 years

**Social Score: 82**

#### Governance Score Calculation

Grace has:
- ✓ Valid mining license (expires 2026)
- ✓ Environmental permit from ZEMA
- ✓ Tax compliance (all payments current)
- ✓ Annual ESG report published online
- ✓ Transparent worker registry

**Governance Score: 79**

#### Detailed Environmental Data

Grace enters additional details:
- **Water Usage:** 30,000 liters/ton of ore
- **Carbon Intensity:** 450 kg CO₂e/ton
- **Safety Practices:** "All workers receive 8-hour safety training before starting. We provide hard hats, masks, gloves, boots. Monthly safety committee meetings. Zero fatal accidents in 24 months. Quarterly health inspections."
- **Rehabilitation Plan:** "After mining concludes, we will rehabilitate mined areas over 3 years. Planting 15,000 indigenous acacia trees. Restoring water sources to pre-mining levels. Monthly soil quality monitoring. Budget allocated: $75,000."

### Step 5: Grace Submits Registration

**Form Summary Before Submit:**
- Environmental: 75/100
- Social: 82/100
- Governance: 79/100
- Overall ESG: (75+82+79)÷3 = **78.7 → 79/100** ✓
- Green Premium: 79% × 30% = **23.7% premium** ✓

**Grace Clicks:** "Register Batch" button

**System Processing:**
1. Batch assigned ID: `LTB-2025-001`
2. Blockchain hash generated: `0xLITHTRUST:a3c5f2e8b1d9...` (stored on Polygon)
3. QR code generated linking to batch
4. Batch status: **Unverified** (needs documents for higher tiers)
5. Verification status: **Unverified (0% premium until verified)**

**Success Message:** 
> "Batch registered successfully with ESG data! Batch ID: LTB-2025-001. Your blockchain hash: 0xLITHTRUST:a3c5f2e8b1d9..."

**Redirected to:** All Batches page

---

## Phase 3: Uploading Documents for Verification

### Step 6: Grace Views Her Batch

**All Batches Page Shows:**
- Batch card for `LTB-2025-001`
- Status: Mining
- ESG Score: 79/100 (green indicator)
- Verification: **Unverified** (gray) - 0% green premium
- Weight: 5,000 kg

**Grace Clicks:** The batch card → Opens Batch Detail Modal

### Step 7: Batch Detail Modal Opens

**Overview Tab Shows:**

🔴 **Verification Status Card** (Prominent):
- Status: **Unverified**
- Green Premium: **0%** (can't sell at premium yet)
- Message: "Upload documents to increase verification level"
- Blockchain Hash: `0xLITHTRUST:a3c5f2e8b1d9...` (proof on blockchain)

**Other Details:**
- Batch Number: LTB-2025-001
- Weight: 5,000 kg
- Grade: Spodumene
- Lithium Content: 2.5%
- Status: Active
- Mine: Harare Central Lithium Mine
- Miner: Grace Mutare

### Step 8: Grace Uploads Documents

Grace clicks: **"Documents" Tab**

**Current Documents:** None yet

Grace uploads her supporting evidence:

#### Document 1: Water Audit Report
- **Type:** Report
- **File:** Water_Usage_Audit_2024.pdf
- **Uploaded:** Grace's external water consultant's report confirming 30,000 L/ton usage
- **Status:** Uploaded ✓ (Pending verification)

#### Document 2: Community Agreement
- **Type:** Certificate
- **File:** Community_Benefit_Agreement_2023.pdf
- **Uploaded:** Signed agreement with Harare Local Council confirming 5% profit sharing
- **Status:** Uploaded ✓ (Pending verification)

#### Document 3: Mining License
- **Type:** Permit
- **File:** Zimbabwe_Mining_License_2024.pdf
- **Uploaded:** Official government mining license valid through 2026
- **Status:** Uploaded ✓ (Pending verification)

#### Document 4: Safety Audit Report
- **Type:** Audit
- **File:** Annual_Safety_Audit_2024.pdf
- **Uploaded:** Third-party safety audit showing zero incidents, all compliance met
- **Status:** Uploaded ✓ (Pending verification)

#### Document 5: Carbon Footprint Calculation
- **Type:** Report
- **File:** Carbon_Footprint_Assessment_2024.pdf
- **Uploaded:** Detailed calculation showing 450 kg CO₂e/ton methodology
- **Status:** Uploaded ✓ (Pending verification)

**All documents uploaded!** ✓

**Verification Status Updated:** `Pending` (🟡 Yellow) - Awaiting auditor review

---

## Phase 4: Third-Party Auditor Verification

### Step 9: Auditor Reviews Documents

**What Happens (Behind Scenes):**
1. Grace's batch is flagged as "Pending" in system
2. An approved auditor from LithiTrust's list is assigned
3. Auditor downloads all 5 documents
4. Auditor begins review (takes 1-2 weeks)

**Auditor's Review Checklist:**

✓ Water Audit Report:
- Confirms 30,000 L/ton calculation
- Verifies 70% recycling claim
- Checks against peer benchmarks
- **Validated:** Environmental score 75/100 is accurate

✓ Community Agreement:
- Confirms written agreement exists
- Verifies signatures and date
- Checks 5% profit-sharing clause
- **Validated:** Social score includes verified community component

✓ Mining License:
- Confirms government registration
- Checks expiration date (2026 - valid)
- Verifies no compliance violations on record
- **Validated:** Governance score legitimacy

✓ Safety Audit:
- Reviews incident records
- Confirms zero fatalities
- Checks training documentation
- **Validated:** Safety claims are accurate

✓ Carbon Footprint:
- Reviews methodology
- Checks equipment specifications
- Verifies fuel purchase records
- **Validated:** 450 kg CO₂e/ton is accurate, actually conservative

**Auditor's Conclusion:** All claims verified ✓
**Auditor Uploads:** Verification Report: `LithiTrust_Auditor_Verification_Grace_Harare_2025.pdf`

### Step 10: Batch Status Updates

**System automatically updates:**
- Verification Status: `Auditor-Verified` (🟢 Blue)
- Documents marked: All "Verified" with ✓ checkmarks
- New green premium tier unlocked: **10-25%**
- Grace's batch premium: 23.7% (based on 79/100 ESG)

**Grace receives notification:**
> "Your batch LTB-2025-001 has been verified by an independent auditor! Your green premium is now unlocked at 23.7%."

---

## Phase 5: Green Premium Pricing Calculator

### Step 11: Grace Checks Pricing Potential

Grace navigates to: **"Pricing Calculator"** (from sidebar)

**Calculator Form:**
- **Select Batch:** LTB-2025-001 ✓
- **Batch Details Load:**
  - Weight: 5,000 kg
  - ESG Score: 79/100 (Auditor-Verified)
  - Current Stage: Mining

**Pricing Calculation Displayed:**

```
BASE PRICE CALCULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Weight: 5,000 kg
Base Price Per kg: $12/kg
Base Total: $60,000

GREEN PREMIUM CALCULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESG Score: 79/100
Premium Percentage: 23.7%
Premium Amount: $14,220

FINAL SELLING PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base Price: $60,000
+ Green Premium: $14,220
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: $74,220 ✓

VERIFICATION STATUS IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If Unverified: $60,000 (0%)
If Pending: $61,200 (2%)
If Auditor-Verified: $74,220 ✓ (23.7%)
If Government-Certified: $78,600 (31% max)

⚠️ Could earn +$4,380 MORE with 
government certification!
```

**Grace's Reaction:** 
"$14,220 extra revenue! That's more than my monthly operational costs. ESG really pays off."

---

## Phase 6: International Buyer Verification

### Step 12: Grace Gets Interested Buyer

An international lithium processor sees Grace's batch listed on the LithiTrust marketplace.

**Buyer's Verification Process:**

#### Step A: Scan QR Code
- Buyer scans batch QR code with phone
- **Redirected to:** Batch detail page on LithiTrust
- **View:** Grace's batch with all details

#### Step B: Check Verification Status
**Buyer Sees:**
- Batch: LTB-2025-001
- Status: **Auditor-Verified** (🟢 Blue badge)
- Documents: 5 uploaded and verified ✓
- ESG Score: 79/100
- Blockchain Hash: `0xLITHTRUST:a3c5f2e8b1d9...`

#### Step C: Download Verification Report
- Buyer downloads: `LithiTrust_Auditor_Verification_Grace_Harare_2025.pdf`
- Contains: Full audit details, auditor credentials, verification date

#### Step D: Verify Blockchain Hash
- Buyer uses Replit API: `GET /api/blockchain/verify/LTB-2025-001`
- **Response:**
```json
{
  "batchId": "LTB-2025-001",
  "batchNumber": "LTB-2025-001",
  "blockchainHash": "0xLITHTRUST:a3c5f2e8b1d9...",
  "isVerified": true,
  "network": "Polygon Mumbai (Testnet)",
  "verificationStatus": "auditor-verified"
}
```

**Buyer's Confidence:** ✓ 100% - Batch is authentic and ESG-verified

---

## Phase 7: Optional - Government Certification

### Step 13: Grace Pursues Government Certification

Grace decides to pursue maximum premium (30%) by seeking government certification.

**Grace submits to:** Zimbabwe Mining Development Authority (ZMDA)
**Provides:**
- All batch details from LithiTrust
- Auditor verification report
- Original documents
- Request for government inspection

**Government Office Reviews:**
1. Cross-checks against mining database
2. Verifies operational compliance
3. Confirms auditor legitimacy
4. Conducts site inspection at mine

**Result:** Government Certification Approved ✓

**System Updates:**
- Verification Status: `Government-Certified` (🟢 Green)
- New Premium Tier: **25-30%** (maximum)
- Grace's New Price: $78,600 (30% premium)
- **Additional Revenue:** +$4,380 vs. auditor-verified

**Grace receives email:**
> "Your batch has been government-certified! Maximum green premium of 30% is now active. Your batch price has increased to $78,600."

---

## Phase 8: Supply Chain Tracking & Export

### Step 14: Batch Moves Through Supply Chain

**Timeline in System:**

**Day 1 - Mining Complete**
- Status updates: `processing`
- Event recorded: "Batch extracted and ready for processing"
- Location: Harare Central Mine
- Stakeholder: Grace Mutare

**Day 5 - Processing Begins**
- Status updates: `processing`
- Event recorded: "Batch sent to Harare processing facility"
- Stakeholder: Integrated Lithium Processing Corp
- Location: Harare Processing Hub
- Notes: "Concentrating ore, removing impurities"

**Day 15 - Export Preparation**
- Status updates: `export`
- Event recorded: "Batch certified ready for export"
- Stakeholder: ZimTrade Export Services
- Location: Harare Export Terminal
- Documents: Export permit attached

**Day 20 - Shipped**
- Status updates: `export`
- Event recorded: "Batch shipped via air freight"
- Destination: Johannesburg (first stop)
- Tracking: LTB-2025-001-EXPORT-001

**Day 25 - Delivered to Buyer**
- Status updates: `delivered`
- Event recorded: "Batch received and verified by buyer"
- Location: International Lithium Processor, Singapore
- Buyer: Global Battery Materials Inc.
- Confirmation: Blockchain hash verified, authenticity confirmed

### Step 15: Complete Timeline View

Grace (or buyer) can view entire supply chain in **History Tab:**

```
Mining [Day 1]
    ↓
Processing [Day 5-15]
    ↓
Export Preparation [Day 15]
    ↓
Shipped [Day 20]
    ↓
Delivered [Day 25] ✓

Full chain of custody maintained
Every stage verified by stakeholder
Blockchain immutably records all steps
```

---

## Final Results Summary

### Grace's Achievements:

✅ **Batch Registered:** LTB-2025-001
- 5,000 kg Spodumene ore
- 2.5% lithium content
- ESG Score: 79/100

✅ **Documents Uploaded:** 5 audited and verified
- Water usage confirmation
- Community agreement
- Mining license
- Safety report
- Carbon footprint calculation

✅ **Auditor Verification:** Approved (🟢 Blue)
- Independent third-party review
- All claims validated
- Unlocked 23.7% green premium

✅ **Government Certification:** Approved (🟢 Green)
- Maximum 30% green premium
- Export authority approved
- International buyer confidence

✅ **Revenue Impact:**
- Base price: $60,000
- Green premium: $18,600 (30%)
- **Final price: $78,600**
- **Extra revenue: +$18,600 (31% increase)**

✅ **Supply Chain:**
- Complete traceability from mine to buyer
- Every stage recorded and verified
- Blockchain immutably stores all data
- International buyer confirms authenticity

---

## Key Learnings from Demo

### For Miners:
1. **Documentation Matters** - Uploading proof documents increases verification level
2. **ESG Translates to Revenue** - 79/100 ESG = 30% price premium = $18,600 extra
3. **Blockchain Ensures Trust** - Immutable records convince international buyers
4. **Verification Levels Unlock Value** - Unverified → Auditor → Government = +$18,600

### For International Buyers:
1. **QR Code Verification** - Instant authenticity check via blockchain
2. **Auditor Reports** - Independent verification builds confidence
3. **Supply Chain Transparency** - Every step recorded and traceable
4. **ESG Certification** - Proof of responsible sourcing for ESG-focused portfolios

### For Regulators:
1. **Complete Visibility** - All batches tracked in jurisdiction
2. **Verification Audit Trail** - Documents show compliance
3. **Government Authority** - Can approve/reject certifications
4. **Fraud Prevention** - Blockchain + document verification prevents faking

---

## Technical Architecture Demonstrated

**Grace's Journey Involved:**

| System | Action |
|--------|--------|
| Frontend | Registration form, ESG data entry, document upload UI |
| Backend | Batch creation, document management, verification tracking |
| Database | Batch record, ESG data, documents, supply chain events |
| Blockchain | Hash generation, storage on Polygon, immutable verification |
| API | Document upload/retrieval, verification status updates |
| Auth | Replit OAuth login, role-based access (Miner role) |

---

## Success Criteria Met ✓

- [x] Miner registered batch with ESG data
- [x] Documents uploaded for verification
- [x] Auditor verified claims independently
- [x] Government certification obtained
- [x] Green premium pricing calculated
- [x] International buyer verified authenticity
- [x] Supply chain tracked end-to-end
- [x] Blockchain immutably recorded all data
- [x] Fair price premium earned: $18,600
- [x] Multi-stakeholder coordination successful

---

**This demo shows how LithiTrust solves the lithium supply chain challenge: transparency, fairness, and opportunity for Zimbabwean miners.**
