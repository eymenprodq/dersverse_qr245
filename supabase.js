import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eGdoZ3pxdXZzbmdlaGpqdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MDIxOTAsImV4cCI6MjEwNTQ3ODE5MH0.8MPZiIwOar7BIPJ9q2-t6oLxjCr2Kl03oh24xBEkwFs'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
