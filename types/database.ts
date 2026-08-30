export type UserRole = 'TEACHER' | 'PARENT' | 'STUDENT';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'PARTIAL';
export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CHECK' | 'OTHER';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Level {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  hourly_rate?: number | null;
  monthly_fee?: number | null;
  teacher_id: string;
  level_id: string;
  created_at: string;
  updated_at: string;
  // Relations
  level?: Level;
  teacher?: Profile;
  students_count?: number;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  active: boolean;
  enrollment_date: string;
  level_id: string;
  group_id?: string | null;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  level?: Level;
  group?: Group;
  parents?: ParentStudent[];
}

export interface ParentStudent {
  id: string;
  parent_id: string;
  student_id: string;
  relationship?: string | null;
  created_at: string;
  parent?: Profile;
  student?: Student;
}

export interface Session {
  id: string;
  group_id: string;
  date: string;
  start_time: string;
  end_time: string;
  topic?: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  group?: Group;
  attendances?: Attendance[];
}

export interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  note?: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  session?: Session;
  student?: Student;
}

export interface Payment {
  id: string;
  student_id: string;
  month: number;
  year: number;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  paid_at?: string | null;
  receipt_no?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  student?: Student;
}

export interface Note {
  id: string;
  student_id: string;
  session_id?: string | null;
  teacher_id: string;
  content: string;
  visible_to_parent: boolean;
  created_at: string;
  // Relations
  student?: Student;
  session?: Session;
  teacher?: Profile;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      levels: {
        Row: Level;
        Insert: Omit<Level, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Level, 'id'>>;
      };
      groups: {
        Row: Group;
        Insert: Omit<Group, 'id' | 'created_at' | 'updated_at' | 'level' | 'teacher' | 'students_count'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Group, 'id'>>;
      };
      students: {
        Row: Student;
        Insert: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'level' | 'group' | 'parents'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Student, 'id'>>;
      };
      parent_students: {
        Row: ParentStudent;
        Insert: Omit<ParentStudent, 'id' | 'created_at' | 'parent' | 'student'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ParentStudent, 'id'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'group' | 'attendances'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Session, 'id'>>;
      };
      attendances: {
        Row: Attendance;
        Insert: Omit<Attendance, 'id' | 'created_at' | 'updated_at' | 'session' | 'student'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Attendance, 'id'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'student'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Payment, 'id'>>;
      };
      notes: {
        Row: Note;
        Insert: Omit<Note, 'id' | 'created_at' | 'student' | 'session' | 'teacher'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Note, 'id'>>;
      };
    };
  };
};
