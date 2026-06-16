# gmcsuspension.com — Referral Program Spec

The referral mechanism for recruiting the ~165 partners in
`gmcsuspension-referral-partners.csv`. Built on Stripe promotion codes — **no
custom code required**.

## The offer (locked)

| Lever | Value |
|---|---|
| Customer discount | **20% off** the $99 audit (→ customer pays $79.20) |
| Partner commission | **$25 flat** per completed (non-refunded) sale |
| Attribution | **Unique promo code per partner** (e.g. `ZATO20`) — redemption count = referrals |
| Payout cadence | **Monthly**, after the 7-day refund window clears |
| Min. payout | **$50** (carries over until reached; keeps payout admin sane) |

### Per-sale economics (sanity check)

```
List price            $99.00
− 20% discount       −$19.80
= Customer pays        $79.20
− Stripe fee (~2.9%+30¢)  ~$2.60
− Partner commission  −$25.00
− Audit cost (API/infra) ~$3.00
= You keep            ~$48.60   (≈49% margin retained)
```

## How attribution works (the key trick)

In Stripe, create **one Coupon** (20% off) and attach **many Promotion Codes** to
it — one per partner. Each promotion code tracks its own `times_redeemed`, so the
redemption count *is* your referral tracking. No affiliate software, no link
cookies.

## Stripe setup (one-time, ~15 min)

1. **Products** → confirm the $99 audit price exists.
2. **Product catalog → Coupons → New**: 20% off, **Duration: Once**.
   - Optional restrictions: minimum order none; **expiration** optional; leave
     "first-time only" off (suspended merchants are usually new customers anyway).
3. For each partner, **add a Promotion Code** to that coupon:
   - Code = `PARTNER20` (uppercase, partner-recognizable: `ECOMKING20`, `RPPC20`).
   - Leave max redemptions unlimited unless you want to cap a test.
4. **Checkout**: enable `allow_promotion_codes = true` so the field shows at
   checkout — *or* pass `?prefilled_promo_code=PARTNER20` in the partner's link so
   it auto-applies.
5. **Reading results**: Dashboard → the coupon shows each promo code's
   `times_redeemed`. Export monthly for payout.

> ⚠️ One coupon + N promo codes — **not** N coupons. Per-code redemption counts
> are what give you per-partner performance for free.

## Monthly payout process

1. Export redemptions per promo code from Stripe.
2. Subtract any orders refunded under the 7-day guarantee (**commission is void on
   refunds** — clawback rule, stated in partner terms).
3. Pay $25 × net redemptions to each partner ≥ $50 via Wise/PayPal.
4. Log in `gmcsuspension-partner-tracking.csv`.

## Guardrails

- **Modest discount on purpose.** 20%, not 40% — keeps price integrity when codes
  leak to coupon-aggregator sites, and the panic-buyer converts on urgency anyway.
- **Unique codes** mean a leaked/abused code can be deactivated without touching
  the rest.
- **Commission, not discount, is the partner hook.** Lead outreach with "earn $25
  per sale," not the customer discount.

## Optional launch lever

For a splashier first pitch, run a **time-boxed 30% code** for the first 2 weeks of
each partner's promotion, reverting to 20% — a headline number without permanently
eroding price.

---

# Partner Offer (one-pager — paste into outreach / a Notion page)

**Help your audience get un-suspended — and earn $25 per sale.**

When a store gets suspended by Google Merchant Center, their Shopping ads stop and
revenue dies overnight. **gmcsuspension.com** scans their store against 40+ Merchant
Center compliance factors and returns a fix-it report in under 60 seconds.

**The deal:**
- Your audience gets **20% off** with your code.
- You earn **$25 for every sale** your code drives.
- Paid **monthly** (Wise/PayPal), $50 minimum.
- Your own code (e.g. `YOURNAME20`) — no dashboards to manage, no links to track.

**Why it converts:** suspended merchants are actively searching for a fix *right
now*. This is a problem your audience has and a tool they'll thank you for.

*Want in? Reply and I'll set up your code today.*

---

# Outreach templates (commission-led)

## A — Creators / communities

> **Subject:** earn $25/sale helping your audience fix Google suspensions
>
> Hi [Name],
>
> Your audience runs Google Shopping — which means some of them get their Merchant
> Center suspended and lose sales overnight. We built **gmcsuspension.com**: an
> automated audit that tells them exactly why they were flagged and how to fix it,
> in 60 seconds.
>
> I'd love to give your audience a **20% off code** and pay you **$25 per sale** it
> drives — paid monthly, your own code, nothing to manage.
>
> Want me to spin up `[NAME]20` so you can try it? Happy to send a free audit of
> any store first.
>
> — [You], gmcsuspension.com

## B — Agencies / consultants

> **Subject:** a fix to hand suspended clients (and a referral fee for you)
>
> Hi [Name],
>
> When a [Agency] client's Merchant Center gets suspended, your Shopping campaigns
> stop and your results take the hit — for something that isn't your fault.
>
> **gmcsuspension.com** diagnoses *why* an account was flagged and exactly how to
> fix it, in minutes. I'd like to give you a code that gets your clients **20% off**
> and pays **[Agency] $25 per sale** — paid monthly.
>
> Can I run a free audit on a suspended client's store this week so you can see it
> work?
>
> — [You], gmcsuspension.com
