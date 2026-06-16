# SESSION HANDOFF — Amazon Seller Suspension / Reinstatement Product (CONCEPT)

> Purpose: preserve the full concept + decisions so a future session can resume
> with zero memory. **Status: PARKED CONCEPT — not started.** No product, no
> domain chosen, no validation done yet. **Last updated:** 2026-06-16.
> **Branch:** `claude/earning-100k-week-6klwft`

---

## 0. STATUS & WHY IT'S PARKED

This is an idea we explored, then **paused** — not rejected. Auke got
(legitimately) uncomfortable with the **responsibility**: the product's value
depends on Amazon's reinstatement decision, which we don't control, and it's a
high-stakes niche (a suspended seller's whole livelihood). We worked out *how to
de-risk it* (sections 4–5) before moving on to other work. Resume from there.

## 1. CONTEXT

Operator: **Auke** (auke.haan@hotmail.nl). Runs a portfolio of niche digital
products and already operates **gmcsuspension.com** — a $99 automated Google
Merchant Center suspension-audit tool. This Amazon idea is **"the gmcsuspension
playbook on a ~10× bigger, higher-pain market."**

## 2. THE CONCEPT

An **Amazon Seller account suspension → reinstatement** tool.

Core deliverable: seller pastes their **suspension notice**; the tool (1) classifies
the violation type, (2) audits the account/listings, and (3) generates a tailored,
**Amazon-policy-referenced Plan of Action (POA) / appeal letter** in minutes.

**Tiered pricing (proposed):**
| Tier | What | Price |
|---|---|---|
| Self-serve POA generator | Paste notice → audit + drafted appeal | $149–299 one-time |
| Expert-reviewed POA | AI draft + human polish | $499–799 |
| Done-for-you reinstatement | We write + manage the appeal cycle | $1,500–2,500 |
| Re-suspension monitoring | Ongoing account-health scan | $29–49/mo (recurring tail) |

## 3. WHY IT WINS

- **Catastrophic, urgent pain:** suspension stops the seller's entire income AND
  locks inventory in FBA warehouses → they pay fast.
- **Proven willingness to pay:** reinstatement consultants/lawyers already charge
  **$500–3,000** per POA.
- **Strong AI fit:** a POA is structured, policy-referenced persuasive writing —
  exactly what an LLM does well (better fit than the GMC audit).
- **Shared infrastructure** with gmcsuspension (audit architecture, conditional
  guarantee, PR-launch motion).
- **Built-in distribution:** cross-sell to Auke's existing ecommerce / GMC audience
  (many sell on Amazon too) — this is the key to fast revenue.
- **Market size:** ~2.5M active Amazon sellers; suspensions are frequent.

## 4. THE BIG RISK (why it felt heavy) AND THE RESOLUTION

**Problem:** any product that promises an OUTCOME owned by a third party
(Amazon's reinstatement verdict) is built on sand — that's the source of both the
responsibility weight and the "how do we guarantee it works" worry.

**Resolution — guarantee the controllable, not the uncontrollable:**
- ❌ "We'll get you reinstated." (uncontrollable)
- ✅ "We'll give you a **complete, policy-referenced audit and appeal that
  addresses every issue Amazon flagged — or your money back.**" (controllable,
  verifiable on delivery)

Two product classes: *outcome-dependent* (heavy) vs *verifiable-deliverable*
(light). This product becomes "light" by selling the **deliverable**, not the verdict.

## 5. HOW TO MAKE THAT GUARANTEE ENFORCEABLE (the build)

"Every issue Amazon flagged" is a **finite, knowable input** (the notice states the
reasons), so completeness is mechanically checkable. Pipeline:

1. **Extract** each flagged reason from the notice → a structured checklist. That
   list = the definition of "complete" for the case.
2. **Policy knowledge base (RAG):** store Amazon's violation taxonomy + policy text,
   required POA structure, common root causes, accepted corrective/preventive
   actions, and required evidence (invoices, LOAs, etc.). The model is grounded in
   this — makes output genuinely "policy-referenced."
3. **Structured POA per issue:** root cause → corrective action → preventive
   measure + policy citation + evidence list.
4. **Coverage validator (the mechanism behind the guarantee):** before delivery,
   programmatically verify every checklist item has a completed block. If any is
   unaddressed, it can't ship. Store the coverage map as an audit trail.
5. **LLM-as-checker** (rubric critique) + **human sign-off** on the guaranteed / DFY
   tier (essential early; builds the dataset to trust automation later).
6. **Pre-launch validation:** run a test set of real anonymized notices across
   violation categories; expert grades **completeness** (drive to ~100%) and
   **soundness**. Don't switch on the guarantee until completeness ~100%.
7. **Intake gate:** require the actual suspension notice; **decline** cases where
   completeness can't be scoped or that are genuinely unwinnable (a free pre-check
   that says "we can help / see a lawyer"). Protects customers, refund rate, conscience.
8. **Scope discipline:** the guarantee covers **completeness + grounding, NOT
   reinstatement.** Marketing copy must match exactly, or you recreate the risk.

## 6. DOMAIN & POSITIONING

- The **reinstatement** product needs its **own exact-match domain** (e.g.
  `amazonsuspensionappeal.com`, `amazonplanofaction.com`) — mirroring how
  gmcsuspension.com captures panic-search intent. Do NOT put it on
  `amazonlistingaudit.com`.
- `amazonlistingaudit.com` (owned) suits the **safer, verifiable** product: an
  Amazon **listing + compliance-risk audit** (prevention — "here's what could get
  you suspended"). That market is crowded (Helium 10, Jungle Scout, SellerApp,
  CopyMonkey, Keywords.am) — differentiate on **compliance/suspension-risk**, which
  the incumbents ignore.
- **Funnel:** listing/compliance audit (prevention, on amazonlistingaudit.com) →
  escalate anyone already suspended to the reinstatement product (own domain).

## 7. RECOMMENDED FIRST STEP — CONCIERGE MVP (do this before building)

Manually handle ~5–10 real suspension cases by hand (source: r/AmazonSeller posts,
Auke's GMC customers who also sell on Amazon). Write the POAs, submit, watch
outcomes. Benchmark against $1k consultant output. Measure the reinstatement rate.
This proves the approach works on real cases for ~$0 before any automation spend.

## 8. THE $100K MATH (honest)

Blend example: 250 self-serve @ $199 ($50k) + 40 DFY @ $1,500 ($60k) = **~$110k**
from ~290 customers. The DFY tier means low volume can still hit the number.
**Honest odds:** $100k of collected cash in literal month 1 is aggressive
(hinges on email-list size + paid-ad spend on desperate-intent keywords like
"amazon account suspended"). A **$100k/month run-rate within 60–90 days** is the
realistic target; month 1 likely $30–70k.

## 9. ETHICAL GUARDRAILS (non-negotiable)

- Legitimate when it helps a seller **genuinely fix real violations and
  communicate honestly** to Amazon.
- **Refuse:** fabricating documents/invoices, gaming/evading Amazon's detection,
  or helping bad actors stay on the platform.
- **Never guarantee reinstatement.** Use a conditional refund tied to the
  deliverable (completeness), not the verdict — same as gmcsuspension.
- Honest = good business here: it's what keeps refunds/chargebacks low.

## 10. COMPETITORS

Existing **manual** reinstatement services: KeyCommerce, GMBJet, GMC Approval,
OptiMerchant, DiscoverMyBusiness, Trusted Web Eservices, 2POINT. An **automated,
instant, cheaper** tool is the differentiation. (They could also be white-label /
API customers rather than only rivals.)

## 11. OPEN DECISIONS / NEXT STEPS FOR A FRESH SESSION

1. **Decide go/no-go** given the responsibility — Auke's call. If go:
2. Run the **concierge MVP** (section 7) to validate before building.
3. Pick + register the **exact-match domain** for reinstatement.
4. Decide build order: prevention audit (safer, on amazonlistingaudit.com) first,
   reinstatement (higher-velocity) second — or vice versa.
5. Only then build the engine (extract → policy-KB audit → coverage-validated POA).

## 12. HOW I (CLAUDE) WORK — expectations

- **No cross-session memory.** This file is the only bridge; nothing carries over.
- **Integrations re-authenticate every session.**
- **The repo is the source of truth** — uncommitted = lost to me.
- Work currently lives on branch `claude/earning-100k-week-6klwft` (merge to main or
  check out the branch to see it).
