create extension if not exists "pgcrypto";


create table if not exists tasks (
    id uuid primary key default gen_random_uuid(),

    user_email text not null,
    title text not null,
    completed boolean not null default false,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists pomodoro_sessions (
    id uuid primary key default gen_random_uuid(),

    user_email text not null,
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


create table if not exists task_sessions (
    task_id uuid not null references tasks(id) on delete cascade,
    session_id uuid not null references pomodoro_sessions(id) on delete cascade,

    primary key (task_id, session_id)
);


create table if not exists users(
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    name text,
    password_hasdh text, -- null for OAuth-only users
    provider text not null default 'credentials', -- 'google' | 'credentials'
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists tasks_user_created_idx
    on tasks (user_email, created_at desc);

create index if not exists pomodoro_sessions_user_started_idx
    on pomodoro_sessions (user_email, started_at desc);

create index if not exists pomodoro_sessions_user_status_idx
    on pomodoro_sessions (user_email, status);