import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Помага при дебагирање ако .env не е пополнет
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase не е конфигуриран. Пополни ги VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY во .env датотеката.'
  )
}

export const supabase = createClient(url || 'http://localhost', anonKey || 'public-anon-key')
