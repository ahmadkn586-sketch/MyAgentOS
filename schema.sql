-- AgentOS Database Schema for Supabase
-- Paste this entire file into Supabase SQL Editor and click Run

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =========================================
-- USERS TABLE (extends Supabase auth.users)
-- =========================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  business_name text,
  business_type text,
  plan text default 'starter' check (plan in ('starter', 'growth', 'scale')),
  setup_complete boolean default false,
  vapi_api_key text,
  vapi_phone_number text,
  stripe_customer_id text,
  stripe_subscription_id text,
  billing_cycle text default 'monthly' check (billing_cycle in ('monthly', 'annual')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- AI BRAIN TABLE
-- =========================================
create table public.ai_brain (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  practice_name text,
  practice_type text,
  address text,
  main_phone text,
  emergency_phone text,
  website text,
  opening_hours jsonb default '{
    "monday": {"open": "09:00", "close": "17:00", "isOpen": true},
    "tuesday": {"open": "09:00", "close": "17:00", "isOpen": true},
    "wednesday": {"open": "09:00", "close": "17:00", "isOpen": true},
    "thursday": {"open": "09:00", "close": "17:00", "isOpen": true},
    "friday": {"open": "09:00", "close": "17:00", "isOpen": true},
    "saturday": {"open": "09:00", "close": "17:00", "isOpen": false},
    "sunday": {"open": "09:00", "close": "17:00", "isOpen": false}
  }'::jsonb,
  about_text text,
  common_questions jsonb default '[]'::jsonb,
  emergency_keywords jsonb default '["chest pain", "emergency", "urgent", "can''t breathe", "accident", "collapsing", "stroke", "unconscious"]'::jsonb,
  scammer_blocking boolean default true,
  ai_tone text default 'professional' check (ai_tone in ('professional', 'friendly_professional', 'warm_approachable')),
  system_prompt text,
  updated_at timestamp with time zone default now()
);

alter table public.ai_brain enable row level security;

create policy "Users manage own AI brain"
  on public.ai_brain for all
  using (auth.uid() = user_id);

-- =========================================
-- APPOINTMENTS TABLE
-- =========================================
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_name text not null,
  contact_number text,
  appointment_date date,
  appointment_time time,
  reason text,
  status text default 'pending' check (status in ('confirmed', 'pending', 'cancelled')),
  booked_by text default 'AI Assistant',
  vapi_call_id text,
  created_at timestamp with time zone default now()
);

alter table public.appointments enable row level security;

create policy "Users manage own appointments"
  on public.appointments for all
  using (auth.uid() = user_id);

-- =========================================
-- AI EMPLOYEES TABLE
-- =========================================
create table public.ai_employees (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  vapi_assistant_id text,
  phone_number text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default now()
);

alter table public.ai_employees enable row level security;

create policy "Users manage own AI employees"
  on public.ai_employees for all
  using (auth.uid() = user_id);

-- =========================================
-- MESSAGES TABLE (voicemail-style messages)
-- =========================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  caller_number text,
  message_summary text,
  vapi_call_id text,
  status text default 'new' check (status in ('new', 'read', 'replied')),
  reply_note text,
  created_at timestamp with time zone default now()
);

alter table public.messages enable row level security;

create policy "Users manage own messages"
  on public.messages for all
  using (auth.uid() = user_id);

-- =========================================
-- AUTOMATIONS TABLE
-- =========================================
create table public.automations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  automation_type text not null check (automation_type in ('sms_confirmation', 'daily_summary_email', 'emergency_backup_alert')),
  enabled boolean default true,
  last_triggered_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(user_id, automation_type)
);

alter table public.automations enable row level security;

create policy "Users manage own automations"
  on public.automations for all
  using (auth.uid() = user_id);

-- =========================================
-- KNOWLEDGE BASE DOCUMENTS TABLE
-- =========================================
create table public.knowledge_documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  filename text not null,
  storage_path text,
  status text default 'processing' check (status in ('processing', 'active', 'failed')),
  created_at timestamp with time zone default now()
);

alter table public.knowledge_documents enable row level security;

create policy "Users manage own documents"
  on public.knowledge_documents for all
  using (auth.uid() = user_id);

-- =========================================
-- NOTIFICATION PREFERENCES TABLE
-- =========================================
create table public.notification_preferences (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  email_emergency_alert boolean default true,
  sms_emergency_alert boolean default false,
  daily_call_summary boolean default true,
  weekly_performance_report boolean default false
);

alter table public.notification_preferences enable row level security;

create policy "Users manage own notification preferences"
  on public.notification_preferences for all
  using (auth.uid() = user_id);

-- Done. All tables, relationships, and security policies created.
