-- Additional tables needed for the mobile app
-- Run this after running the main schema.sql

-- Notes table for teacher-uploaded study materials
create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  subject text not null,
  file_url text not null,
  file_path text not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- Books table for library inventory
create table if not exists public.books (
  id uuid primary key default uuid_generate_v4(),
  book_name text not null,
  author text not null,
  isbn text unique,
  total_copies integer not null default 1 check (total_copies > 0),
  available_copies integer not null default 1 check (available_copies >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

-- Fines table for overdue book charges
create table if not exists public.fines (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.library_requests (id) on delete cascade,
  amount numeric not null check (amount >= 0),
  due_date date not null,
  is_paid boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

-- Enable RLS on new tables
alter table public.notes enable row level security;
alter table public.books enable row level security;
alter table public.fines enable row level security;

-- Notes policies: Students can read, teachers can insert their own
create policy "Students can view notes"
  on public.notes
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.is_approved = true
    )
  );

create policy "Teachers can upload notes"
  on public.notes
  for insert
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'teacher'
        and p.is_approved = true
    )
    and teacher_id = auth.uid()
  );

-- Books policies: Everyone can read, admins can manage
create policy "Approved users can view books"
  on public.books
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.is_approved = true
    )
  );

create policy "Admins manage books"
  on public.books
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Fines policies: Students can view their own, admins can manage all
create policy "Students view own fines"
  on public.fines
  for select
  using (
    exists (
      select 1
      from public.library_requests lr
      where lr.id = fines.request_id
        and lr.student_id = auth.uid()
    )
  );

create policy "Admins manage fines"
  on public.fines
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Update library_requests to allow admin updates
create policy "Admins manage library requests"
  on public.library_requests
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

