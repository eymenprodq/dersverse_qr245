import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co'
// Supabase panelinizden Project Settings > API kısmındaki 'anon' key'i buraya yapıştırın
const SUPABASE_ANON_KEY = 'sb_publishable_qgcYdZz60VDBkfLZ3UVftw_G9o30nYd'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)