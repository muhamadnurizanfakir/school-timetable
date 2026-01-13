# School Timetable System

A modern, responsive, realtime timetable application built with React, Tailwind CSS, and Supabase.

## Features
- **Public Access**: View timetables without login. Switch between students/classes.
- **Admin Access**: Authenticated editing of slots via Supabase Auth.
- **Realtime**: Updates populate instantly across all devices.
- **Mobile First**: Optimized card layout for phones, grid for desktops.

## Setup Instructions

### 1. Supabase Setup (Manual Method)
If you prefer not to use SQL scripts, follow these steps:

**A. Create Tables**
1. Go to **Table Editor** -> **New Table**.
2. Create `persons`:
   - `id` (uuid, Primary Key, default: `gen_random_uuid()`)
   - `name` (text)
   - `class_name` (text, nullable)
   - Enable RLS.
3. Create `timetable_slots`:
   - `id` (uuid, Primary Key, default: `gen_random_uuid()`)
   - `person_id` (uuid, Foreign Key to `persons.id`, Action: Cascade)
   - `day_of_week` (text)
   - `start_time` (text)
   - `end_time` (text)
   - `subject` (text)
   - `teacher` (text)
   - Enable RLS.

**B. Set Permissions (RLS)**
1. Go to **Authentication** -> **Policies**.
2. For both tables, add a policy for **SELECT** allowing `true` (Public read).
3. For both tables, add a policy for **ALL** allowing `auth.role() = 'authenticated'` (Admin write).

**C. Enable Realtime**
1. Go to **Database** -> **Publications**.
2. Select `supabase_realtime` and ensure `timetable_slots` is checked.

**D. Add Data**
1. Go to **Table Editor** -> `persons`.
2. Add rows for: `ADEEB RAZIN` (Class: 5 Dedikasi), `AKIF RIFQI` (Class: 1 Arif), `KHADIJAH`.

### 2. Local Development
1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory using `.env.example` as a template.
4. Fill in your Supabase URL and Anon Key (found in Project Settings -> API).
5. Run the server:
   ```bash
   npm run dev
   ```

### 3. Vercel Deployment
1. Push code to GitHub.
2. Login to Vercel and "Add New Project".
3. Import your GitHub repository.
4. In "Environment Variables", add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

## Usage Guide

### For Public Users
1. Open the website.
2. Select a name from the dashboard.
3. View the weekly schedule.

### For Admins
1. Click "Admin Login" in the header.
2. Enter your Supabase user credentials.
3. Once logged in:
   - **Add Slot**: Click the "+ Add Slot" button.
   - **Edit/Delete**: Use controls on the cards.
   - **Manage Persons**: Use the Supabase Dashboard to add/edit student names and class names.
