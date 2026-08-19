// Voice of Goila Directory System
// Final Version With Image Support


let allDirectory = [];


// ==============================
// LOAD DIRECTORY
// ==============================

async function loadDirectory(){


    const {data,error}=

    await window.supabaseClient

    .from("directory_items")

    .select("*")

    .order("id",{ascending:false});



    if(error){

        console.log(error);

        return;

    }


    allDirectory = data || [];


    loadCategoryFilter();


    displayDirectory(allDirectory);


}






// ==============================
// CATEGORY FILTER
// ==============================


function loadCategoryFilter(){


    const categoryBox =
    document.getElementById("categoryFilter");


    if(!categoryBox)
    return;



    let categories =

    [...new Set(

        allDirectory.map(
            item=>item.cat
        )

    )];



    categoryBox.innerHTML = `

    <option value="">
    সব ক্যাটাগরি
    </option>

    `;



    categories.forEach(cat=>{


        categoryBox.innerHTML +=`

        <option value="${cat}">
        ${cat}
        </option>

        `;


    });


}






// ==============================
// SEARCH + FILTER
// ==============================


function filterDirectory(){


    let search =

    document.getElementById("searchBox")
    ?.value
    .toLowerCase() || "";



    let cat =

    document.getElementById("categoryFilter")
    ?.value || "";



    let sub =

    document.getElementById("subCategoryFilter")
    ?.value || "";




    let result =

    allDirectory.filter(item=>{


        return (

            item.name
            ?.toLowerCase()
            .includes(search)

            ||

            item.address
            ?.toLowerCase()
            .includes(search)

        )

        &&

        (

            !cat ||

            item.cat===cat

        )

        &&

        (

            !sub ||

            item.subcat===sub

        );


    });



    displayDirectory(result);


}








// ==============================
// SHOW DIRECTORY
// ==============================


function displayDirectory(data){


    const box =

    document.getElementById("directory");


    if(!box)
    return;



    if(!data || data.length===0){


        box.innerHTML=

        `
        <div class="empty">
        কোনো তথ্য পাওয়া যায়নি
        </div>
        `;


        return;

    }





    box.innerHTML = data.map(item=>{


    return `


    <div class="directory-card">



        ${
        item.image_url ?

        `

        <div class="directory-image">

        <img 

        src="${item.image_url}"

        alt="${item.name || ''}"

        loading="lazy"

        >

        </div>

        `

        :

        ""

        }




        <h3>
        ${item.name || ""}
        </h3>



        <p>
        📂 ${item.cat || ""}
        </p>



        <p>
        📌 ${item.subcat || ""}
        </p>



        <p>
        📍 ${item.address || ""}
        </p>




        ${
        item.phone ?

        `

        <a href="tel:${item.phone}"

        class="call-btn">

        📞 কল করুন

        </a>

        `

        :

        ""

        }




        ${
        item.map_url ?

        `

        <a href="${item.map_url}"

        target="_blank"

        class="map-btn">

        🗺️ ম্যাপ দেখুন

        </a>

        `

        :

        ""

        }



    </div>


    `;


    }).join("");


}








// ==============================
// INIT
// ==============================


window.addEventListener(

"load",

()=>{


    setTimeout(

        loadDirectory,

        500

    );


});






// Search listener

document.addEventListener(

"input",

function(e){


    if(
        e.target.id==="searchBox"
    )

    filterDirectory();


});







// Category change

document.addEventListener(

"change",

function(e){


    if(

        e.target.id==="categoryFilter"

        ||

        e.target.id==="subCategoryFilter"

    )

    filterDirectory();


});
