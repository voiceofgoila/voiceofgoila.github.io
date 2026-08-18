// Voice of Goila - Supabase Connection

const SUPABASE_URL = "https://etrwqgzyhbsdvbbbsqbv.supabase.co";

const SUPABASE_KEY = "sb_publishable_VgWn42qW9qMWEJsIuwNr9A_Usq71VHL";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase Connected Successfully");
