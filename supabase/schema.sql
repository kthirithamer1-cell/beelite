-- ==============================================================================
-- Be Elite with Bassem - Supabase Database Schema, RLS & Auto-Confirm Trigger
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Types / Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('TEACHER', 'PARENT', 'STUDENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PAID', 'PENDING', 'PARTIAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('CASH', 'TRANSFER', 'CHECK', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'TEACHER',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Levels Table (Niveaux scolaires en Tunisie)
CREATE TABLE IF NOT EXISTS public.levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Groups Table (Groupes de cours)
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    hourly_rate NUMERIC(10, 2) DEFAULT 0.00,
    monthly_fee NUMERIC(10, 2) DEFAULT 80.00,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    level_id UUID REFERENCES public.levels(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Students Table (Élèves)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    level_id UUID REFERENCES public.levels(id) ON DELETE RESTRICT,
    group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Parent-Student Association Table
CREATE TABLE IF NOT EXISTS public.parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    relationship TEXT DEFAULT 'Parent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(parent_id, student_id)
);

-- 8. Sessions Table (Séances de cours)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TEXT NOT NULL, -- Format "16:00"
    end_time TEXT NOT NULL,   -- Format "17:30"
    topic TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Attendance Table (Présences)
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'PRESENT',
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(session_id, student_id)
);

-- 10. Payments Table (Cotisations en Dinars Tunisiens DT)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status payment_status NOT NULL DEFAULT 'PENDING',
    method payment_method NOT NULL DEFAULT 'CASH',
    paid_at TIMESTAMPTZ,
    receipt_no TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, month, year)
);

-- 11. Notes Table (Remarques & Conseils de Prof. Bassem)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    visible_to_parent BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- Auto-Confirm Emails Trigger (Eliminates "Email not confirmed" block)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_before_insert ON auth.users;
CREATE TRIGGER on_auth_user_before_insert
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- Auto-confirm any existing unconfirmed users
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- ==============================================================================
-- Automatic Profile Trigger on Supabase Auth Sign Up
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, phone)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'TEACHER'),
        new.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        role = EXCLUDED.role;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'TEACHER'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_teacher());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated users can view levels" ON public.levels;
CREATE POLICY "Authenticated users can view levels" ON public.levels FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers can manage levels" ON public.levels;
CREATE POLICY "Teachers can manage levels" ON public.levels FOR ALL TO authenticated USING (public.is_teacher());

DROP POLICY IF EXISTS "Teachers can manage their groups" ON public.groups;
CREATE POLICY "Teachers can manage their groups" ON public.groups FOR ALL TO authenticated USING (teacher_id = auth.uid() OR public.is_teacher());

DROP POLICY IF EXISTS "Parents can view groups of their children" ON public.groups;
CREATE POLICY "Parents can view groups of their children" ON public.groups FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.parent_students ps
        JOIN public.students s ON s.id = ps.student_id
        WHERE ps.parent_id = auth.uid() AND s.group_id = groups.id
    )
);

DROP POLICY IF EXISTS "Teachers can manage students" ON public.students;
CREATE POLICY "Teachers can manage students" ON public.students FOR ALL TO authenticated USING (public.is_teacher());

DROP POLICY IF EXISTS "Parents can view their children" ON public.students;
CREATE POLICY "Parents can view their children" ON public.students FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.parent_students ps
        WHERE ps.parent_id = auth.uid() AND ps.student_id = students.id
    )
);

DROP POLICY IF EXISTS "Teachers can manage parent_students" ON public.parent_students;
CREATE POLICY "Teachers can manage parent_students" ON public.parent_students FOR ALL TO authenticated USING (public.is_teacher());

DROP POLICY IF EXISTS "Parents can view their student links" ON public.parent_students;
CREATE POLICY "Parents can view their student links" ON public.parent_students FOR SELECT TO authenticated USING (parent_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can manage sessions" ON public.sessions;
CREATE POLICY "Teachers can manage sessions" ON public.sessions FOR ALL TO authenticated USING (public.is_teacher());

DROP POLICY IF EXISTS "Parents can view sessions" ON public.sessions;
CREATE POLICY "Parents can view sessions" ON public.sessions FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.parent_students ps
        JOIN public.students s ON s.id = ps.student_id
        WHERE ps.parent_id = auth.uid() AND s.group_id = sessions.group_id
    )
);

DROP POLICY IF EXISTS "Teachers can manage attendances" ON public.attendances;
CREATE POLICY "Teachers can manage attendances" ON public.attendances FOR ALL TO authenticated USING (public.is_teacher());

DROP POLICY IF EXISTS "Parents can view their children's attendances" ON public.attendances;
CREATE POLICY "Parents can view their children's attendances" ON public.attendances FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.parent_students ps
        WHERE ps.parent_id = auth.uid() AND ps.student_id = attendances.student_id
    )
);

DROP POLICY IF EXISTS "Teachers can manage payments" ON public.payments;
CREATE POLICY "Teachers can manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_teacher());

DROP POLICY IF EXISTS "Parents can view their children's payments" ON public.payments;
CREATE POLICY "Parents can view their children's payments" ON public.payments FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.parent_students ps
        WHERE ps.parent_id = auth.uid() AND ps.student_id = payments.student_id
    )
);

DROP POLICY IF EXISTS "Teachers can manage notes" ON public.notes;
CREATE POLICY "Teachers can manage notes" ON public.notes FOR ALL TO authenticated USING (public.is_teacher());

DROP POLICY IF EXISTS "Parents can view visible notes for their children" ON public.notes;
CREATE POLICY "Parents can view visible notes for their children" ON public.notes FOR SELECT TO authenticated USING (
    visible_to_parent = true AND EXISTS (
        SELECT 1 FROM public.parent_students ps
        WHERE ps.parent_id = auth.uid() AND ps.student_id = notes.student_id
    )
);

-- ==============================================================================
-- DEFAULT SEED LEVELS
-- ==============================================================================
INSERT INTO public.levels (name, description) VALUES
    ('7ème année de base', 'Collège - 7ème année'),
    ('8ème année de base', 'Collège - 8ème année'),
    ('9ème année de base (Brevet)', 'Collège - 9ème année de base (النوفيام)'),
    ('1ère année Secondaire', 'Lycée - Tronc commun'),
    ('2ème année Secondaire', 'Lycée - Spécialités (Sciences, Éco, Info, Lettres)'),
    ('3ème année Secondaire', 'Lycée - Pré-Baccalauréat'),
    ('Baccalauréat (Toutes sections)', 'Lycée - Année du Baccalauréat')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;
