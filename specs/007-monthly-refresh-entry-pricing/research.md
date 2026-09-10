# Research: does AED 5 a plant work?

The founder set the price. This is the arithmetic that says what has to be true
for it to hold, so the number can be argued with rather than hoped over.

Two figures here are sourced. Everything else is labelled an assumption and is a
dial the founder should turn.

| Input | Value | Where it comes from |
| --- | --- | --- |
| Plant rental, entry | AED 5 / month | Founder, 2026-09-10 |
| Service fee, fortnightly | AED 150 / month | Existing price list |
| Write-off target | 4% of fleet / month | Constitution, PRD |
| Technician salary | AED 5,164 / month | Indeed AE, 109 salaries, May 2026 (research ref 153) |
| Technician fully loaded | AED 8,000 / month | **Assumed**: salary plus visa, insurance, vehicle, fuel |
| Stops per working day | 10 | **Assumed** |
| Working days | 22 / month | **Assumed** |
| Plants per site | 15 | **Assumed** |
| Plant plus planter, delivered | AED 40 | **Assumed** — Planty has no supplier costs recorded yet |

## The plant line pays for itself, barely, and only if plants are cheap

A plant earns AED 5 a month. At the 4% monthly write-off the constitution
targets, a plant lives about 25 months, so it earns roughly AED 125 across its
life.

That gives one hard number, and it is the number to hold on to:

> **A plant must cost under AED 125 delivered, or it loses money at AED 5 a
> month before anyone has driven to it.**

At an assumed AED 40 for plant and planter, the write-off costs AED 1.60 a month
against AED 5 of revenue, leaving AED 3.40 a month per plant. That is a thin but
positive line, and it does not have to carry the labour — the service fee does.

The number to watch is not the price. It is the write-off rate, because the
depot already measures it. At 4% the desk plant clears. At 8% it earns AED 1.80
a month and the AED 125 ceiling halves to AED 62. The ledger built in feature
006 reports this rate on the depot page; it stops being a curiosity under this
pricing and becomes the number that decides whether the business works.

## The service fee pays the person

One technician doing 10 stops a day, 22 days a month, makes 220 visits. On the
fortnightly cadence each site takes 2.17 of those, so one technician covers
about **101 sites**.

| | Monthly |
| --- | --- |
| Service revenue, 101 sites × AED 150 | 15,150 |
| Plant revenue, 101 × 15 plants × ~AED 7 avg | 10,600 |
| **Revenue** | **25,750** |
| Technician, fully loaded | (8,000) |
| Write-offs, 4% of 1,515 plants × AED 40 | (2,424) |
| **Before overhead, depot rent and vehicle capital** | **15,326** |

The service fee alone covers the technician about twice over. This is why the
spec leaves it alone: at AED 5 a plant, the service fee is the business, and
cutting it to look cheaper would remove the only line that pays a salary.

## What actually constrains it

**Stops per day, not price.** Every figure above rests on 10 stops a day. At 6
stops the same technician covers 61 sites, service revenue falls to AED 9,150,
and the margin roughly halves. This is the constitution's first principle
arriving as arithmetic: route density is the business. It is also why feature
008 exists.

**Working capital.** 1,515 plants at AED 40 is about **AED 60,000** tied up in
stock before the first invoice. Cheap rental does not reduce that, it lengthens
the time to get it back. A plant at AED 45 a month returned its cost in under a
month; at AED 5 it takes eight.

**The zone minimum, which is now doing nothing.** At the old prices a small
order came to about AED 450 and the AED 400 minimum almost never bound. At the
new prices the same order is about AED 180, so a AED 400 minimum would bind on
nearly every customer and quietly undo the headline. It drops to AED 150.

Worth being plain about the consequence: **at AED 150 the minimum can never
bind.** Every priceable basket already includes a service fee of at least AED
150, so every total clears it. The minimum is now a dormant guard rather than a
working one.

That is the right outcome rather than an oversight. The minimum existed to stop
a stop being worth less than the drive, and the service fee now does that job
directly — nobody can buy plants without buying a visit. The setting stays
because it is the thing to reach for if a cheaper cadence is ever introduced, at
which point it starts binding again without a deploy. If the founder wants it to
bite today, raising it above AED 150 is one edit in `/ops/zones`, and the cost
is that the smallest customers get turned away.

## The price ladder

Chosen to honour "from AED 5" while keeping larger plants meaningfully dearer.
Desk plants fall about ninefold, floor and statement plants about fivefold, so
the premium for size survives the cut.

| Plant | Was | Now |
| --- | --- | --- |
| Golden pothos · desk | 45 | **5** |
| Snake plant · desk | 55 | 6 |
| ZZ plant · desk | 60 | 7 |
| Chinese evergreen · desk | 65 | 8 |
| Snake plant · floor | 95 | 16 |
| Chinese evergreen · floor | 100 | 18 |
| ZZ plant · floor | 105 | 19 |
| Areca palm · statement | 165 | 32 |
| Kentia palm · statement | 175 | 35 |

Every one of these is operator-editable in `/ops/pricing`. They are a starting
point, not a finding — the founder should move them against real sales, and the
system was built so that costs no deploy.

## What this does not answer

- **Real plant costs.** The AED 40 above is invented. A single afternoon with a
  wholesaler in Al Quoz replaces it, and it is the input the AED 125 ceiling is
  most sensitive to.
- **Whether AED 5 sells.** Cheaper is not the same as chosen. The pricing
  hypothesis stays a hypothesis until someone pays.
- **Churn.** The 25-month plant life assumes the plant leaves the fleet only by
  dying. A customer cancelling at month three ends its earning life early and no
  figure here accounts for it.
