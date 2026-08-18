// Voice of Goila - Directory Items Loader

async function loadDirectoryItems() {

    const { data, error } = await supabaseClient
        .from("directory_items")
        .select("*")
        .order("id", { ascending: true });


    if (error) {
        console.error("Directory loading error:", error);
        return;
    }


    console.log("Directory Items Loaded:", data);

}


// Run loader
loadDirectoryItems();
