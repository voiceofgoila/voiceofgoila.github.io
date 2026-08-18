// Voice of Goila - Directory Items Loader (Fixed)

async function loadDirectoryItems() {

    const { data, error } = await window.supabaseClient
        .from("directory_items")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Directory loading error:", error);
        return;
    }

    console.log("Directory Items Loaded:", data);

    const container = document.getElementById("directory");

    if (!container) {
        console.error("Directory container not found");
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>কোনো তথ্য পাওয়া যায়নি।</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(item => {

        const card = document.createElement("div");

        card.className = "directory-card";

        card.innerHTML = `
            <div class="card-inner">
                <h3>${item.name || ""}</h3>
                <p>ক্যাটাগরি: ${item.cat || ""}</p>
                <p>সাব-ক্যাটাগরি: ${item.subcat || ""}</p>
                <p>ফোন: ${item.phone || ""}</p>
                <p>ঠিকানা: ${item.address || ""}</p>
            </div>
        `;

        container.appendChild(card);

    });
}

loadDirectoryItems();
