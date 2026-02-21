import { supabase } from './supabase';

export async function saveSaleToSupabase(saleData: {
  agent_id: string;
  apv: number;
  status: 'Submitted' | 'Placed';
  submitted_date: string;
  placed_date?: string;
  comm_rate: number;
}) {
  const { data, error } = await supabase
    .from('sales')
    .insert([saleData])
    .select();

  if (error) {
    console.error('[Supabase] Error saving sale:', error);
    throw error;
  }

  return data;
}

export async function saveActivityToSupabase(activityData: {
  agent_id: string;
  date: string;
  dials: number;
  contacts: number;
  booked_appts: number;
  appts_run: number;
  presentations: number;
  sales: number;
}) {
  const { data, error } = await supabase
    .from('activity')
    .upsert([activityData], {
      onConflict: 'agent_id,date'
    })
    .select();

  if (error) {
    console.error('[Supabase] Error saving activity:', error);
    throw error;
  }

  return data;
}
