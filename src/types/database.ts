export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TaskType = "revision" | "exam" | "homework";
export type TaskStatus = "todo" | "doing" | "done";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          title: string;
          type: TaskType;
          deadline: string;
          estimated_hours: number;
          difficulty: number;
          status: TaskStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_id: string;
          title: string;
          type?: TaskType;
          deadline: string;
          estimated_hours?: number;
          difficulty?: number;
          status?: TaskStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_id?: string;
          title?: string;
          type?: TaskType;
          deadline?: string;
          estimated_hours?: number;
          difficulty?: number;
          status?: TaskStatus;
          created_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string;
          date: string;
          duration_minutes: number;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id: string;
          date: string;
          duration_minutes?: number;
          completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string;
          date?: string;
          duration_minutes?: number;
          completed?: boolean;
        };
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          task_id: string;
          planned_date: string;
          duration_minutes: number;
          priority_score: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id: string;
          planned_date: string;
          duration_minutes?: number;
          priority_score?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string;
          planned_date?: string;
          duration_minutes?: number;
          priority_score?: number;
        };
      };
    };
  };
}

export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];
export type StudyPlan = Database["public"]["Tables"]["study_plans"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
