-- ─────────────────────────────────────────────────────────────────────────
-- VanFácil — schema de referência para Supabase (Postgres)
-- Este projeto ainda roda 100% com dados fictícios em memória (ver
-- src/data/mockData.ts). Este arquivo é o mapa para quando ele migrar para
-- um banco real — os tipos em src/types.ts foram escritos para bater 1:1
-- com as tabelas abaixo. Ver o resumo no final da conversa para o roteiro
-- de migração passo a passo.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto"; -- gen_random_uuid()

create type student_status as enum ('ativo', 'inativo', 'lista_espera');
create type route_shift as enum ('matutino', 'vespertino', 'integral');
create type payment_status as enum ('pago', 'pendente', 'atrasado');
create type payment_method as enum ('pix', 'dinheiro', 'cartao', 'transferencia');
create type expense_category as enum ('combustivel','pedagio','manutencao','seguro','limpeza','ipva','outros');

-- Um motorista = um usuário autenticado (auth.users). Hoje o app assume um
-- motorista/uma van só; driver_id já existe nas tabelas abaixo para permitir
-- múltiplas vans por conta mais tarde sem quebrar nada.
create table drivers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  vehicle_model text,
  plate text,
  capacity int not null default 15,
  odometer_km numeric not null default 0,
  city text,
  pix_key text,
  created_at timestamptz not null default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  auth_user_id uuid references auth.users(id), -- login do responsável, quando houver
  name text not null,
  guardian_name text not null,
  guardian_phone text not null,
  email text,
  pickup_address text,
  dropoff_address text,
  pickup_time time,
  dropoff_time time,
  school text,
  shift route_shift not null default 'matutino',
  plan_value numeric(10,2) not null default 0,
  due_day smallint not null default 5 check (due_day between 1 and 28),
  preferred_method payment_method not null default 'pix',
  status student_status not null default 'ativo',
  joined_at date not null default current_date
);
create index on students (driver_id);

create table student_documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  name text not null,
  file_url text not null, -- Supabase Storage path (bucket "documents")
  uploaded_at timestamptz not null default now()
);

-- reference_month fica sempre no dia 01 do mês (facilita agrupar/ordenar).
create table payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  reference_month date not null,
  amount numeric(10,2) not null,
  due_date date not null,
  paid_date date,
  status payment_status not null default 'pendente',
  method payment_method,
  proof_url text, -- Supabase Storage path (bucket "receipts"), comprovante do responsável
  created_at timestamptz not null default now(),
  unique (student_id, reference_month)
);
create index on payments (student_id);
create index on payments (status);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  category expense_category not null,
  description text not null,
  amount numeric(10,2) not null,
  date date not null,
  odometer_km numeric,
  liters numeric,
  receipt_url text, -- Supabase Storage path (bucket "receipts")
  created_at timestamptz not null default now()
);
create index on expenses (driver_id, date);

create table vehicle_documents (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  name text not null,
  due_date date not null,
  renewal_cost numeric(10,2)
);

create table maintenance_items (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  name text not null,
  interval_km numeric,
  interval_months numeric,
  last_done_date date not null,
  last_done_km numeric not null default 0
);

create table absence_notices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

create table notices (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  title text not null,
  message text not null,
  audience text not null default 'todos', -- 'todos' | 'matutino' | 'vespertino' | 'integral'
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table ratings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  name text not null,
  guardian_name text not null,
  phone text not null,
  desired_shift route_shift not null default 'matutino',
  requested_at timestamptz not null default now()
);

-- ── Row Level Security — exemplo de política ────────────────────────────
-- Habilite RLS em toda tabela com dado sensível e restrinja por dono.
alter table students enable row level security;
alter table payments enable row level security;
alter table expenses enable row level security;

-- Motorista só vê/edita os próprios alunos.
create policy "motorista gerencia seus alunos"
  on students for all
  using (driver_id in (select id from drivers where auth_user_id = auth.uid()));

-- Responsável (aluno) só vê o cadastro do próprio filho.
create policy "responsavel ve seu proprio cadastro"
  on students for select
  using (auth_user_id = auth.uid());

-- Motorista vê pagamentos dos seus alunos; responsável vê só os do próprio filho.
create policy "motorista ve pagamentos dos seus alunos"
  on payments for all
  using (student_id in (
    select s.id from students s join drivers d on d.id = s.driver_id
    where d.auth_user_id = auth.uid()
  ));

create policy "responsavel ve seus proprios pagamentos"
  on payments for select
  using (student_id in (select id from students where auth_user_id = auth.uid()));

-- Despesas são só do motorista dono da van (aluno nunca deve ler esta tabela).
create policy "motorista gerencia suas despesas"
  on expenses for all
  using (driver_id in (select id from drivers where auth_user_id = auth.uid()));
