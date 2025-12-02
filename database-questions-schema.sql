-- Database schema for test questions and options
-- Run this after running the main schema.sql and database-extensions.sql

-- Test questions table
create table if not exists public.test_questions (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid not null references public.tests (id) on delete cascade,
  question_text text not null,
  question_number integer not null,
  marks integer not null default 1 check (marks > 0),
  created_at timestamptz not null default timezone('utc', now())
);

-- Test question options table
create table if not exists public.test_question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references public.test_questions (id) on delete cascade,
  option_text text not null,
  option_letter text not null, -- A, B, C, D, etc.
  is_correct boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

-- Test answers table (to store student answers)
create table if not exists public.test_answers (
  id uuid primary key default uuid_generate_v4(),
  test_result_id uuid not null references public.test_results (id) on delete cascade,
  question_id uuid not null references public.test_questions (id) on delete cascade,
  selected_option_id uuid references public.test_question_options (id),
  is_correct boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

-- Enable RLS on new tables
alter table public.test_questions enable row level security;
alter table public.test_question_options enable row level security;
alter table public.test_answers enable row level security;

-- Test questions policies: Everyone can read, teachers can insert/update their own tests
create policy "Everyone can view test questions"
  on public.test_questions
  for select
  using (true);

create policy "Teachers can manage questions for their tests"
  on public.test_questions
  for all
  using (
    exists (
      select 1
      from public.tests t
      where t.id = test_questions.test_id
        and t.created_by = auth.uid()
    )
  );

-- Test question options policies: Everyone can read, teachers can manage
create policy "Everyone can view test question options"
  on public.test_question_options
  for select
  using (true);

create policy "Teachers can manage options for their questions"
  on public.test_question_options
  for all
  using (
    exists (
      select 1
      from public.test_questions tq
      join public.tests t on t.id = tq.test_id
      where tq.id = test_question_options.question_id
        and t.created_by = auth.uid()
    )
  );

-- Test answers policies: Students can view their own, teachers can view all for their tests
create policy "Students can view their own answers"
  on public.test_answers
  for select
  using (
    exists (
      select 1
      from public.test_results tr
      where tr.id = test_answers.test_result_id
        and tr.student_id = auth.uid()
    )
  );

create policy "Students can insert their own answers"
  on public.test_answers
  for insert
  with check (
    exists (
      select 1
      from public.test_results tr
      where tr.id = test_answers.test_result_id
        and tr.student_id = auth.uid()
    )
  );

create policy "Teachers can view answers for their tests"
  on public.test_answers
  for select
  using (
    exists (
      select 1
      from public.test_results tr
      join public.tests t on t.id = tr.test_id
      where tr.id = test_answers.test_result_id
        and t.created_by = auth.uid()
    )
  );

-- Add created_by column to tests table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'tests' and column_name = 'created_by'
  ) then
    alter table public.tests add column created_by uuid references public.profiles (id);
  end if;
end $$;

-- Add index for better performance
create index if not exists idx_test_questions_test_id on public.test_questions (test_id);
create index if not exists idx_test_question_options_question_id on public.test_question_options (question_id);
create index if not exists idx_test_answers_test_result_id on public.test_answers (test_result_id);
create index if not exists idx_test_answers_question_id on public.test_answers (question_id);

