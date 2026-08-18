// Voice of Goila - Directory Items Loader

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


    const containers = [
        document.getElementById("directoryCards"),
        document.getElementById("directoryList"),
        document.getElementById("cards")
    ];


    const container = containers.find(c => c !== null);


    if (!container) {
        console.warn("Directory container not found");
        return;
    }


    container.innerHTML = "";


    data.forEach(item => {

        const card = document.createElement("div");

        card.className = "directory-card";


        card.innerHTML = `
            <h3>${item.name || "নাম নেই"}</h3>
            <p>${item.cat || ""}</p>
            <p>${item.phone || ""}</p>
            <p>${item.address || ""}</p>
        `;


        container.appendChild(card);

    });

}


loadDirectoryItems();
