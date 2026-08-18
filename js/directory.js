// Voice of Goila - Directory Loader

async function loadDirectoryItems() {

    const { data, error } = await window.supabaseClient
        .from("directory_items")
        .select("*")
        .order("id", { ascending: true });


    if (error) {
        console.error("Directory error:", error);
        return;
    }


    console.log("Directory Items Loaded:", data);


    const container = document.getElementById("directory");


    if (!container) {
        console.error("directory container missing");
        return;
    }


    container.innerHTML = "";


    data.forEach(item => {

        container.innerHTML += `

        <div class="directory-card">

            <h3>${item.name || "নাম নেই"}</h3>

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

            ${
              item.map_url 
              ? `<a href="${item.map_url}" target="_blank">
              Map দেখুন
              </a>`
              : ""
            }

        </div>

        `;

    });

}


loadDirectoryItems();
