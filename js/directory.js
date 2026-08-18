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
        container.innerHTML = `
            <div class="notice-card">
                কোনো তথ্য পাওয়া যায়নি।
            </div>
        `;
        return;
    }


    container.innerHTML = data.map(item => `

        <article class="card">

            <div class="card-inner">

                <h3>${item.name || ""}</h3>

                <div class="meta">
                    <b>ক্যাটাগরি:</b> ${item.cat || ""}
                </div>

                <div class="meta">
                    <b>সাব-ক্যাটাগরি:</b> ${item.subcat || ""}
                </div>

                <div class="meta">
                    <b>ফোন:</b> ${item.phone || "নেই"}
                </div>

                <div class="meta">
                    <b>ঠিকানা:</b> ${item.address || ""}
                </div>

            </div>

        </article>

    `).join("");

}


window.addEventListener("load", () => {
    setTimeout(loadDirectoryItems, 500);
});
