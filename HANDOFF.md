# SESSION HANDOFF — gmcsuspension.com Referral Program

> Purpose: let a brand-new Claude session continue this work with zero memory of
> the prior session. Everything needed is here or in the files listed below.
> **Last updated:** 2026-06-16. **Branch:** `claude/earning-100k-week-6klwft` · **PR:** #3

---

## 0. FIRST THING A NEW SESSION MUST DO

The work lives on branch **`claude/earning-100k-week-6klwft`** (PR #3), NOT on
`main`. A fresh session starting on `main` won't see these files. So either:
- **Merge PR #3**, or
- Have the new session **check out `claude/earning-100k-week-6klwft`** before starting.

Then read this file + the four artifacts in section 3.

---

## 1. WHO / CONTEXT

Operator: **Auke** (auke.haan@hotmail.nl). Runs a portfolio of niche digital
products. Working style: ships fast, launches lean (PR/press + landing page),
prefers concrete action over theory.

**The portfolio (for context):**
| Product | What it is | Model |
|---|---|---|
| **gmcsuspension.com** | Automated Google Merchant Center suspension audit (scans 40+ compliance factors, 60-sec fix report) | **$99 one-time** |
| iwrity.com | Amazon KDP author review-exchange + toolkit | Recurring ($19.99/$29 mo) |
| amazonlistingaudit.com | Owned domain; candidate for an Amazon listing/compliance audit (aged-domain claim UNVERIFIED) | TBD |
| shopify-visitor-analytics (this repo) | Shopify visitor/conversion analytics | — |

## 2. CURRENT PROJECT

Build a **referral/affiliate channel for gmcsuspension.com** to grow sales.

**Offer (LOCKED):**
- Customer gets **20% off** (pays $79.20).
- Partner earns **$25 flat per completed (non-refunded) sale**.
- Attribution = **one unique Stripe promotion code per partner** (one 20% Coupon, many promo codes; redemption count = referrals).
- Payout: **monthly, $50 minimum, refund clawback** (no commission on refunded sales).
- Positioning: commission is the hook for **creators/communities**; for **agencies**, lead with "a suspension hurts your retainer — be the one who fixes it fast," $25 is a bonus.
- Per-sale economics: ~$48.60 retained (~49% margin).

## 3. ARTIFACTS ALREADY PRODUCED (in this repo)

- `gmcsuspension-referral-partners.csv` — ~165 verified prospects, tagged by segment/priority/program/contact.
- `gmcsuspension-referral-program.md` — full spec: economics, Stripe setup steps, payout process, partner offer one-pager, outreach templates.
- `gmcsuspension-partner-tracking.csv` — payout tracking sheet (5 warm leads seeded).
- `gmcsuspension-outreach-emails.md` — 9 personalized outreach messages, signed "Auke."

## 4. TOP WARM LEADS (verified contacts + hooks)

| Prospect | Contact route | Existing program | Personalization hook |
|---|---|---|---|
| Digital Darts (Joshua Uebergang) | sales@digitaldarts.com.au (verify) / LinkedIn | Partner program | Their "Google Merchant Center Programs for Shopify" page — best GMC fit |
| Store Growers (Dennis Moons) | support@storegrowers.com (verified) | none found | Their "Top 4 Options To Get GMC Support (2026)" post |
| The Ecom King (Kamil Sattar) | theecomking.setmore.com / IG DM | none found | Annual free dropshipping course on YouTube |
| ZATO (Kirk Williams @PPCKirk) | zatomarketing.com/contact / LinkedIn | Referral (20% cash) | His "are PMax best practices harmful?" blog |
| JumpFly | jumpfly.com/partnerships / 877-882-2850 | Referral ($1k) | "Mastering PMax 2026" guide; Premier Partner since 2003 |
| Logical Position | logicalposition.com/client-referral-program | Referral ($500) | "55,000+ Google Ads accounts analyzed" |
| Ecommerce Coffee Break (Claus Lauter) | claus@clauslauter.com (verify) | Sponsorship rate card | Recent AI/smart-pricing episode |
| eCommerce Fastlane (Steve Hutt) | ecommercefastlane.com/sponsorship | Sponsorship + tech partner directory | "73% of audience are store owners $250K–$5M/yr" |
| Online Geniuses (David Markovich) | onlinegeniuses.com/partner-with-us | Partner program | "World's largest marketing Slack" |
| Anton Kraly / Drop Ship Lifestyle | dropshiplifestyle.com contact | no open commission affiliate now | High-ticket dropshipping course |
| Foundr (Start & Scale) | support@foundr.com | Affiliate (needs 50k followers) | Gretta van Riel; 21k+ students |
| Ben Heath | benheathmarketing.com/contact | none | DEPRIORITIZE — Meta-focused, weak GMC fit |

## 5. WHAT'S DONE vs OPEN

**DONE:** partner research (165), warm-lead contacts (12), program spec, locked
offer, 9 personalized outreach messages.

**OPEN / BLOCKED — pick up here:**

1. **Create the Stripe coupon + promo codes — NOT done.**
   - Blocker last session: the Stripe MCP OAuth endpoint returned "Server Turned
     Down" (provider-side outage), so the API tools never loaded.
   - **Option A (reliable, ~2 min):** Auke creates it in the Stripe Dashboard:
     dashboard.stripe.com/coupons → New → 20% off, Duration: Once → add a
     promotion code per partner (`ZATO20`, `ECOMKING20`, `STOREGROWERS20`,
     `DIGITALDARTS20`, `OG20`, `JUMPFLY20`, `LP20`, …) → enable "Allow promotion
     codes" at checkout. Redemption count per code = payout basis.
   - **Option B (API):** re-add the Stripe connector fresh in Claude settings, then
     ask the session to run `mcp__Stripe__authenticate` and complete OAuth. Decide
     **test vs live mode** first.

2. **Send the outreach — NOT done.**
   - Only 3 prospects have emails (Store Growers verified; Digital Darts + Coffee
     Break likely-but-verify). For these, a session can create **Gmail drafts**
     (requires the user to approve Gmail access; drafts are NOT auto-sent).
   - The other ~6 are reachable only via **web forms / LinkedIn DMs** — no tool can
     automate these; Auke pastes the ready bodies from `gmcsuspension-outreach-emails.md` manually.

## 6. KEY FACTS ABOUT HOW I (CLAUDE) WORK — so expectations are right

- **No cross-session memory.** A new session knows nothing unless it's in the repo
  or you tell it. This file is the bridge.
- **Integrations (Stripe/Gmail/GitHub) re-authenticate every session** — prior
  authorization does NOT carry over.
- **The repo is the single source of truth.** If it's not committed, it's lost to me.

## 7. OPEN DECISIONS FOR AUKE

- Stripe: **test or live** mode for the coupon?
- Stripe setup: do it yourself in the dashboard (fast) or wait to re-auth the API?
- Which partners to contact first (suggested order: Digital Darts, Store Growers,
  The Ecom King — best GMC fit / highest-suspension audience).
