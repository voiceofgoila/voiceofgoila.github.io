// Voice of Goila - Directory Loader

async function loadDirectoryItems() {

    const container = document.getElementById("directoryList");

    if (!container) {
        console.error("directoryList not found");
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


    container.innerHTML = "";


    data.forEach(item => {

        const card = document.createElement("div");

        card.className = "directory-card";


        card.innerHTML = `
            <h3>${item.name || ""}</h3>
            <p>${item.category || ""}</p>
            <p>${item.description || ""}</p>
            <p>${item.phone || ""}</p>
        `;


        container.appendChild(card);

    });

}


loadDirectoryItems();
