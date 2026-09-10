-- 0010: the swap allowance renews every thirty days, not every ninety.
--
-- Feature 005 gave each subscription a counted swap allowance on a ninety-day
-- window, chosen when a desk plant cost AED 45 a month. At AED 5 a plant the
-- founder wants two swaps a month instead (feature 007, FR-005).
--
-- Only the window changes. `rotation_allowance` keeps its meaning — how many
-- swaps a subscription may spend in one window — and replacements stay free and
-- uncounted, which is what "unlimited refreshes" refers to.

-- The window length lives in one place now, so the next time it moves it moves
-- once. Feature 005 spelled 90 into both functions and they had to agree.
create function public.rotation_window_days()
returns integer
language sql
immutable
as $$ select 30; $$;

comment on function public.rotation_window_days() is
  'Length of one swap allowance window, in days. Feature 007 moved it from 90.';

create or replace function public.rotation_period_start(p_subscription_id uuid)
returns date
language sql
security definer
set search_path = ''
stable
as $$
  select case
    -- Before installation the subscription is in its first window, which runs
    -- from when it was created — otherwise a request made between ordering and
    -- installation would fall outside every window and cost nothing.
    when current_date < s.installation_date then s.created_at::date
    else s.installation_date
         + (floor((current_date - s.installation_date)::numeric
                  / public.rotation_window_days())::int
            * public.rotation_window_days())
  end
    from public.subscriptions s
   where s.id = p_subscription_id;
$$;

create or replace function public.rotation_period_end(p_subscription_id uuid)
returns date
language sql
security definer
set search_path = ''
stable
as $$
  select s.installation_date
         + ((floor(greatest((current_date - s.installation_date), 0)::numeric
                   / public.rotation_window_days())::int + 1)
            * public.rotation_window_days())
    from public.subscriptions s
   where s.id = p_subscription_id;
$$;

grant execute on function public.rotation_window_days() to authenticated, anon;

-- ── entry pricing (feature 007, FR-004) ──────────────────────────────
--
-- At the old list a small order came to about AED 450 and the AED 400 minimum
-- almost never bound. At AED 5 a plant the same order is about AED 180, so the
-- old minimum would bind on nearly every customer and quietly undo the price
-- the catalogue advertises. AED 150 still keeps a stop worth making.
--
-- Prices themselves are operator-edited data and live in seed.sql, not here.
update public.service_zones
   set minimum_monthly_aed = 150.00
 where minimum_monthly_aed = 400.00;
