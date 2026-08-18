// Voice of Goila - Supabase Connection

const SUPABASE_URL = "https://etrwqgzyhbsdvbbbsqbv.supabase.co";

const SUPABASE_KEY = "sb_publishable_VgWn42qW9qMWEJsIuwNr9A_Usq71VHL";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Test connection
async function testSupabaseConnection() {
    const { data, error } = await supabaseClient
        .from("directory_items")
        .select("*")
        .limit(5);

    if (error) {
        console.error("Supabase Error:", error);
        return;
    }

    console.log("Supabase Connected Successfully:", data);
}

testSupabaseConnection();
