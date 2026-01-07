# SignalReview — Founding Review Pipeline

Version: v1 (Founding Review)
Status: Production
Scope: One-time analytical service ($400)

---

## 1. Product Boundary

Product: Founding Review  
Type: Independent Economic Determination  
Output: PDF document + binary scaling signal  
No advisory, no optimization, no projections

---

## 2. High-Level Flow (Client View)

1. Client visits landing page
2. Client submits Founding Review form
3. Client receives submission confirmation email (AUTO-ACK)
4. Client completes payment via Payoneer
5. Assessment is processed internally
6. Client receives Founding Review PDF by email

---

## 3. Technical Pipeline (System View)

### STEP 1 — Landing

Component:
- Static HTML (Cloudflare Pages / GitHub Pages)

Files:
- index.html
- request-founding-review.html
- payment-instructions.html

Responsibility:
- Present product
- Collect inputs
- Route client into pipeline

---

### STEP 2 — Form Submission (AUTO-ACK)

Worker:
- founding-review-autoack

Trigger:
- POST from request-founding-review.html

Responsibilities:
- Validate minimal input
- Send submission confirmation email
- Redirect client to payment instructions

Notes:
- No Assessment ID assigned here
- No analysis performed
- UX-only responsibility

---

### STEP 3 — Payment (Manual Confirmation)

System:
- Payoneer (manual review)

Responsibility:
- Confirm $400 payment
- Verify reference/email match

Notes:
- No automation at this stage (intentional)
- Reduces chargeback and fraud risk

---

### STEP 4 — Assessment Initialization

System:
- Internal process (manual trigger)

Action:
- Generate Assessment ID (FR-YYYYMMDD-XXX)
- Prepare HTML input for PDF rendering

Notes:
- Assessment ID becomes canonical identifier
- Used in logs, PDF, and emails

---

### STEP 5 — PDF Rendering

Worker:
- pdf-diagnostic (aka pdf-runner)

Trigger:
- POST /render

Responsibilities:
- Load Founding Review HTML
- Render PDF via Playwright
- Store PDF in Cloudflare R2
- Generate signed access URL

Notes:
- Core analytical delivery component
- Part of proprietary pipeline (Trade Secret)

---

### STEP 6 — Delivery Email

System:
- Email delivery (Resend)

Responsibilities:
- Send Founding Review PDF link
- Include Assessment ID in subject
- Send BCC copy to internal operator

Notes:
- Delivery confirms completion
- No advice or commentary included

---

## 4. Supporting Infrastructure

### Storage
- Cloudflare R2
  - Stores generated PDFs
  - Signed URLs with expiration

### Email
- Resend
  - AUTO-ACK emails
  - DELIVERY emails

### KV (Planned / Not Active)
- Cloudflare KV

Planned Use:
- Track assessment state:
  - submitted
  - paid
  - rendering
  - delivered

Status:
- Not used in v1
- Reserved for v2 scaling

---

## 5. Workers Inventory

| Worker Name                 | Role                        | Status        |
|----------------------------|-----------------------------|---------------|
| founding-review-autoack    | Form ACK + redirect         | Active        |
| pdf-diagnostic             | PDF rendering + R2 upload   | Active        |
| delivery-worker (optional) | Delivery email abstraction  | Not required  |

---

## 6. Design Principles

- Linear pipeline
- Manual checkpoints where risk exists
- No hidden automation
- Deterministic outputs
- Clear responsibility per component

---

## 7. Legal / IP Notes

- Analytical methodology is proprietary
- Pipeline structure is part of Trade Secret
- No disclosure of internal logic to clients
- Public materials describe scope, not method

---

## 8. Future Extensions (v2+)

- Automated payment confirmation
- KV-backed status tracking
- Multiple product tiers (PDF v2)
- MoR integration (Paddle / equivalent)

---

End of document.
