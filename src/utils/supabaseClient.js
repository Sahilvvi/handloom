import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard against invalid or placeholder URLs to prevent app crash
const isPlaceholder = !supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL');

if (isPlaceholder) {
    console.warn('Supabase URL is missing or still a placeholder. Please configure VITE_SUPABASE_URL in your .env file.');
}

export const supabase = createClient(
    isPlaceholder ? 'https://placeholder.supabase.co' : supabaseUrl,
    supabaseAnonKey || 'placeholder-key'
);
