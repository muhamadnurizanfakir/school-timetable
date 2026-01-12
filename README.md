# School Timetable System

A modern, responsive, realtime timetable application built with React, Tailwind CSS, and Supabase.

## Features
- **Public Access**: View timetables without login. Switch between students/classes.
- **Admin Access**: Authenticated editing of slots via Supabase Auth.
- **Realtime**: Updates populate instantly across all devices.
- **Mobile First**: Optimized card layout for phones, grid for desktops.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project at [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the left sidebar.
3. Copy the content of `supabase_schema.sql` from this project and run it.
4. Go to **Authentication** -> **Providers** and ensure "Email" is enabled.
5. Go to **Authentication** -> **Users** and "Invite User" (this will be your admin).
   - Enter your email and a password you will remember.
   - *Note: Since we are using basic Auth, you can just sign up manually or create the user here.*
6. Go to **Database** -> **Replication**. Ensure the `supabase_realtime` publication includes the `timetable_slots` table. (The SQL script attempts this, but verifying in UI is safer).

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
2. Use the dropdown at the top right (top center on mobile) to select a name (Default: ADEEB RAZIN).
3. View the weekly schedule.

### For Admins
1. Click "Admin Login" in the header.
2. Enter your Supabase user credentials.
3. Once logged in:
   - **Add Slot**: Click the "+ Add Slot" button in the header.
   - **Edit Slot**: Hover over a card (or look at the bottom on mobile) and click "Edit".
   - **Delete Slot**: Click "Delete".
4. Changes are saved immediately and broadcast to all connected users.

## Adding New Persons
Currently, adding new Persons (Students/Classes) is done via the Supabase Dashboard for security simplicity.
1. Go to Supabase -> Table Editor -> `persons`.
2. Click "Insert Row" and add the name.
