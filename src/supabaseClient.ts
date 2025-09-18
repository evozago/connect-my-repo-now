import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jcasmmedljaglyjamjab.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXNtbWVkbGphZ2x5amFtamFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjM1NTQsImV4cCI6MjA3MzU5OTU1NH0.meCnRvoP3Y4-zq5b0rrrTXlW4bVx3cPfhT5IghpJm9E";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
