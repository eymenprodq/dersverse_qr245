import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eGdoZ3pxdXZzbmdlaGpqdmNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkwMjE5MCwiZXhwIjoyMTA1NDc4MTkwfQ.CX5rckDBIstaEo2-tERv4XUIrqv0K9VWQX1Okd26EVM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
