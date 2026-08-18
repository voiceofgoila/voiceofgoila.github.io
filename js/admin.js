// Voice of Goila Admin Final Dynamic Category System


let directoryData = [];


// ===============================
// PAGE LOAD
// ===============================


window.onload = function(){

    checkSession();

};




// ===============================
// SESSION CHECK
// ===============================


async function checkSession(){


    const {data} =
    await window.supabaseClient.auth.getSession();



    if(data.session){

        checkAdmin(data.session.user);

    }


}






// ===============================
// LOGIN
// ===============================


async function login(){


    const email =
    document.getElementById("email").value;


    const password =
    document.getElementById("password").value;



    const {data,error} =
    await window.supabaseClient.auth
    .signInWithPassword({

        email,
        password

    });



    if(error){

        alert("Login Failed");

        console.log(error);

        return;

    }



    checkAdmin(data.user);


}






// ===============================
// ADMIN CHECK
// ===============================


async function checkAdmin(user){


    const {data,error}

    =
    await window.supabaseClient

    .from("admin_users")

    .select("*")

    .eq("user_id",user.id)

    .single();



    if(error || !data){


        alert("Admin Access Denied");

        return;

    }



    showDashboard();


}







// ===============================
// SHOW DASHBOARD
// ===============================


function showDashboard(){


    document
    .getElementById("loginBox")
    .style.display="none";



    document
    .getElementById("dashboard")
    .style.display="block";



    loadAll();


}






// ===============================
// MENU
// ===============================


function toggleMenu(){


    let menu =
    document.getElementById("menu");



    if(menu.style.display==="block"){

        menu.style.display="none";

    }

    else{

        menu.style.display="block";

    }


}





function showDirectory(){


    document
    .getElementById("menu")
    .style.display="none";


    document
    .getElementById("directory")
    .scrollIntoView();


}





// ===============================
// LOGOUT
// ===============================


async function logout(){


    await window.supabaseClient.auth.signOut();


    location.reload();


}







// ===============================
// LOAD ALL
// ===============================


function loadAll(){


    loadStats();

    loadPending();

    loadDirectory();

}







// ===============================
// STATS
// ===============================


async function loadStats(){


    const total =

    await window.supabaseClient

    .from("directory_items")

    .select("*",{count:"exact",head:true});



    document.getElementById("total").innerText =
    total.count || 0;





    const pending =

    await window.supabaseClient

    .from("submissions")

    .select("*",{count:"exact",head:true})

    .eq("status","pending");



    document.getElementById("pendingCount").innerText =
    pending.count || 0;





    const approved =

    await window.supabaseClient

    .from("submissions")

    .select("*",{count:"exact",head:true})

    .eq("status","approved");



    document.getElementById("approvedCount").innerText =
    approved.count || 0;



}






// ===============================
// PENDING LOAD
// ===============================


async function loadPending(){


    const {data,error}=

    await window.supabaseClient

    .from("submissions")

    .select("*")

    .eq("status","pending")

    .order("id",{ascending:false});



    const box =
    document.getElementById("pending");



    if(error){

        console.log(error);

        return;

    }



    if(!data || data.length===0){


        box.innerHTML =
        "কোনো Pending Submission নেই";


        return;


    }




    box.innerHTML = data.map(item=>`


    <div class="item">


    <h3>${item.name}</h3>


    <p>
    Category: ${item.cat}
    </p>


    <p>
    Sub Category: ${item.subcat}
    </p>


    <p>
    Phone: ${item.phone || ""}
    </p>


    <p>
    Address: ${item.address || ""}
    </p>



    <button class="approve action"
    onclick="approveSubmission(${item.id})">

    Approve

    </button>



    <button class="reject action"
    onclick="rejectSubmission(${item.id})">

    Reject

    </button>



    </div>


    `).join("");



}
