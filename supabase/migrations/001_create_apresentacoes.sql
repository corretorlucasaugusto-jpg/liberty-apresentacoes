-- Migration: 001_create_apresentacoes
-- Run: supabase db push  OU  cole no SQL Editor do Supabase Dashboard

-- Tabela de apresentações geradas
create table if not exists public.apresentacoes (
  id          uuid         primary key default gen_random_uuid(),
  user_id     uuid         references auth.users(id) on delete cascade not null,
  cliente     text,
  residencial text,
  bairro      text,
  html        text,                      -- HTML completo da apresentação
  created_at  timestamptz  default now() not null
);

-- RLS: cada corretor só vê suas próprias apresentações
alter table public.apresentacoes enable row level security;

create policy "Corretor vê só as próprias apresentações"
  on public.apresentacoes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index para listagem rápida
create index apresentacoes_user_created
  on public.apresentacoes(user_id, created_at desc);

-- Comentário
comment on table public.apresentacoes is
  'Apresentações de captação geradas pelos corretores Liberty';
