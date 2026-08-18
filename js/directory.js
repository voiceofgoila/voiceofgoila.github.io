// Voice of Goila Directory Loader

async function loadDirectoryItems() {

    console.log("Directory loader started");

    if (!window.supabaseClient) {
        console.error("Supabase client not ready");
        return;
    }

    const container = document.getElementById("directory");

    if (!container) {
        console.error("Directory container not found");
        return;
    }

    const { data, error } = await window.supabaseClient
        .from("directory_items")
        .select("*")
        .order("id", { ascending: true });


    if (error) {
        console.error("Directory loading error:", error);
        return;
    }


    console.log("Directory Items Loaded:", data);


    if (!data || data.length === 0) {
        container.innerHTML = "<p>কোনো তথ্য পাওয়া যায়নি।</p>";
        return;
    }


    container.innerHTML = data.map(item => `

        <div class="directory-card">

            <h3>${item.name || ""}</h3>

            <p>
            ক্যাটাগরি: ${item.cat || ""}
            </p>

            <p>
            সাব-ক্যাটাগরি: ${item.subcat || ""}
            </p>

            <p>
            ফোন: ${item.phone || "নেই"}
            </p>

            <p>
            ঠিকানা: ${item.address || ""}
            </p>

        </div>

    `).join("");

}


window.addEventListener("load", () => {
    setTimeout(loadDirectoryItems, 500);
});
