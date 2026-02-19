create extension if not exists "pgcrypto";
 
create table if not exists pomodoro_sessions (
    id uuid primary key default gen_random_uuid(),

    user_email text,
    task text,

    type text not null check (type in ('focus', 'break')),
    mode text not null check (mode in ('pomodoro', 'shortBreak','longBreak')),

    started_at timestamptz not null,
    ended_at timestamptz,

    planned_duration_seconds integer not null,
    actual_duration_seconds integer,

    status text not null default 'started'
        check (status in ('started', 'completed')),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists pomodoro_sessions_user_started_idx
    on pomodoro_sessions (user_email, started_at desc);