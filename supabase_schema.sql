-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'instructor', 'admin'))
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Handle new user signup automatically
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- COURSES TABLE
create table courses (
  id text primary key, -- using text slug as ID like 'truck-loading'
  title text not null,
  description text,
  duration text,
  modules_count integer default 0,
  category text,
  image_emoji text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table courses enable row level security;

create policy "Courses are viewable by everyone." on courses
  for select using (true);

-- LESSONS TABLE
create table lessons (
  id serial primary key,
  course_id text references courses(id) on delete cascade not null,
  title text not null,
  duration text,
  order_index integer not null,
  content text
);

alter table lessons enable row level security;

create policy "Lessons are viewable by everyone." on lessons
  for select using (true);

-- ENROLLMENTS TABLE
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id text references courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  progress integer default 0,
  status text default 'in-progress' check (status in ('in-progress', 'completed')),
  unique(user_id, course_id)
);

alter table enrollments enable row level security;

create policy "Users can view their own enrollments." on enrollments
  for select using (auth.uid() = user_id);

create policy "Users can insert their own enrollments." on enrollments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own enrollments." on enrollments
  for update using (auth.uid() = user_id);

-- LESSON PROGRESS TABLE
create table lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id integer references lessons(id) on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  status text default 'completed' check (status in ('completed', 'in-progress')),
  unique(user_id, lesson_id)
);

alter table lesson_progress enable row level security;

create policy "Users can view their own lesson progress." on lesson_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert/update their own lesson progress." on lesson_progress
  for all using (auth.uid() = user_id);

-- SEED DATA
insert into courses (id, title, description, duration, modules_count, category, image_emoji) values
('truck-loading', 'Truck Loading and Unloading Safety', 'Comprehensive training on safe procedures for loading and unloading trucks in warehouse environments.', '4 hours', 8, 'Logistics', '🚛'),
('forklift-ops', 'Forklift Operations & Safety', 'Learn safe forklift operation techniques, maintenance checks, and hazard awareness.', '3 hours', 6, 'Equipment', '🏗️'),
('ppe-fundamentals', 'PPE Fundamentals', 'Essential training on selecting, using, and maintaining personal protective equipment.', '2 hours', 5, 'Safety Basics', '🦺'),
('hazmat-handling', 'Hazardous Materials Handling', 'Safe handling, storage, and transportation of hazardous materials in the workplace.', '5 hours', 10, 'Compliance', '☢️'),
('emergency-response', 'Emergency Response Procedures', 'Training on emergency protocols, evacuation procedures, and first response actions.', '3 hours', 7, 'Emergency', '🚨'),
('ergonomics', 'Workplace Ergonomics', 'Prevent injuries through proper lifting techniques and ergonomic workstation setup.', '2 hours', 4, 'Health', '💪');

-- Seed Lessons for Truck Loading (Sample)
insert into lessons (course_id, title, duration, order_index, content) values
('truck-loading', 'Introduction to Loading Safety', '20 min', 1, 'Content for Intro...'),
('truck-loading', 'Personal Protective Equipment (PPE)', '30 min', 2, 'Content for PPE...'),
('truck-loading', 'Pre-Operation Inspection', '25 min', 3, 'Content for Inspection...'),
('truck-loading', 'Safe Loading Procedures', '35 min', 4, 'Content for Loading...'),
('truck-loading', 'Safe Unloading Procedures', '35 min', 5, 'Content for Unloading...'),
('truck-loading', 'Hazard Identification', '30 min', 6, 'Content for Hazards...'),
('truck-loading', 'Emergency Response Protocols', '25 min', 7, 'Content for Emergency...'),
('truck-loading', 'Final Assessment', '40 min', 8, 'Content for Exam...');
