-- Local seed for Planty. See specs/001-foundation-accounts-catalog/quickstart.md
--
-- Test sign-ins (local only, the code is always 123456):
--   050 000 0001  Priya    private customer
--   050 000 0002  Nadia    owner of Northwind Labs
--   050 000 0003  Omar     Planty operator
--   050 000 0004  Tariq    Planty technician

-- ── auth users ───────────────────────────────────────────────────────
-- GoTrue requires the token columns to be empty strings, not NULL.
-- auth.users.phone is stored WITHOUT the leading '+'.

insert into auth.users (
  instance_id, id, aud, role, phone, phone_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token, email_change,
  email_change_token_new, email_change_token_current,
  phone_change, phone_change_token, reauthentication_token
)
values
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
   '971500000001', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
   '971500000002', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
   '971500000003', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated',
   '971500000004', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', '');

-- Profile rows already exist: handle_new_user() fired on the inserts above.
update public.profiles set display_name = 'Priya', email = 'priya@example.com'
  where id = '10000000-0000-4000-8000-000000000001';
update public.profiles set display_name = 'Nadia', email = 'nadia@northwind.example'
  where id = '10000000-0000-4000-8000-000000000002';
update public.profiles set display_name = 'Omar', email = 'omar@planty.example'
  where id = '10000000-0000-4000-8000-000000000003';
update public.profiles set display_name = 'Tariq', email = 'tariq@planty.example'
  where id = '10000000-0000-4000-8000-000000000004';

insert into public.staff_roles (account_id, role) values
  ('10000000-0000-4000-8000-000000000003', 'operator'),
  ('10000000-0000-4000-8000-000000000004', 'technician');
