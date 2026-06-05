create table if not exists public.apresentacoes (
  id          uuid         primary key default gen_random_uuid(),
  user_id     uuid         references auth.users(id) on delete cascade not null,
  cliente     text,
  residencial text,
  bairro      text,
  html        text,
  created_at  timestamptz  default now() not null
);
alter table public.apresentacoes enable row level security;
create policy "Corretor vê só as próprias apresentações"
  on public.apresentacoes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create index if not exists apresentacoes_user_created
  on public.apresentacoes(user_id, created_at desc);
