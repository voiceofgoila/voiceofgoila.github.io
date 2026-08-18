// Voice of Goila - Directory Loader

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
        console.error("directory container not found");
        return;
    }


    container.innerHTML = "";


    data.forEach(item => {

        container.innerHTML += `
        <div class="directory-card">

            <h3>${item.name || ""}</h3>

            <p>${item.cat || ""}</p>

            <p>${item.subcat || ""}</p>

            <p>${item.phone || ""}</p>

            <p>${item.address || ""}</p>

        </div>
        `;

    });

}


loadDirectoryItems();
