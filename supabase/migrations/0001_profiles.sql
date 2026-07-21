-- Account-level `profiles` table. This is intentionally minimal: it holds the
-- per-user metadata you almost always need (email, display name, consent), and
-- gives you a table to hang app-specific columns / synced data off later.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Populates profiles automatically on sign-up. consented_at/display_name come from
-- the client's signUp() call (options.data), written by app/(auth)/sign-up.tsx.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, consented_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'display_name',
    (new.raw_user_meta_data->>'consented_at')::timestamptz
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
