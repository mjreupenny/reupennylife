import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars. ' +
        'Auth persistence and user approval will be disabled until configured.'
    );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

// ─── Types mirroring the DB schema ───────────────────────────

export type UserStatus = 'pending' | 'approved' | 'suspended';
export type UserRole = 'admin' | 'agent';

export interface DBUser {
    id?: string;
    email: string;
    name: string;
    picture?: string;
    role: UserRole;
    status: UserStatus;
    created_at?: string;
    last_login?: string;
}

export interface DBSale {
    id: string;
    agent_id: string;
    apv: number;
    status: 'Submitted' | 'Placed';
    submitted_date: string;
    placed_date?: string;
    comm_rate: number;
    created_at?: string;
}

export interface DBActivity {
    id?: string;
    agent_id: string;
    date: string;
    dials: number;
    contacts: number;
    booked_appts: number;
    appts_run: number;
    presentations: number;
    sales: number;
    created_at?: string;
}

export interface DBAgent {
    id: string;
    name: string;
    email: string;
    join_date: string;
    status: 'Active' | 'Pending' | 'Suspended';
    created_at?: string;
}

// ─── Helpers ──────────────────────────────────────────────────

const ADMIN_EMAILS = new Set([
    'sfg.miller.reupenny@gmail.com',
    'sfg.seta.reupenny@gmail.com',
]);

/**
 * Upsert a user on login. Returns the current user record from DB.
 * Admins are always approved; new users start as pending.
 */
export async function upsertUserOnLogin(user: {
    email: string;
    name: string;
    picture?: string;
}): Promise<DBUser | null> {
    if (!supabaseUrl || !supabaseAnonKey) return null;

    const isAdmin = ADMIN_EMAILS.has(user.email);
    const role: UserRole = isAdmin ? 'admin' : 'agent';
    const defaultStatus: UserStatus = isAdmin ? 'approved' : 'pending';

    // Try to get existing user first
    const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

    if (existing) {
        // Update last_login; keep existing status/role
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString(), name: user.name, picture: user.picture })
            .eq('email', user.email);
        return { ...existing, last_login: new Date().toISOString() } as DBUser;
    }

    // New user — insert with pending status (or approved for admins)
    const { data, error } = await supabase
        .from('users')
        .insert({
            email: user.email,
            name: user.name,
            picture: user.picture,
            role,
            status: defaultStatus,
            last_login: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('[Supabase] upsertUserOnLogin error:', error);
        return null;
    }
    return data as DBUser;
}

/**
 * Get all users with pending status (for admin approval list).
 */
export async function getPendingUsers(): Promise<DBUser[]> {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
    if (error) { console.error('[Supabase] getPendingUsers error:', error); return []; }
    return (data ?? []) as DBUser[];
}

/**
 * Get all users (for admin user management).
 */
export async function getAllUsers(): Promise<DBUser[]> {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('[Supabase] getAllUsers error:', error); return []; }
    return (data ?? []) as DBUser[];
}

/**
 * Update a user's status (approve / suspend).
 */
export async function updateUserStatus(email: string, status: UserStatus): Promise<void> {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const { error } = await supabase.from('users').update({ status }).eq('email', email);
    if (error) console.error('[Supabase] updateUserStatus error:', error);
}
