// Voice of Goila Admin System


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



    const user = data.user;



    const {data:admin,error:adminError}
    =
    await window.supabaseClient
    .from("admin_users")
    .select("*")
    .eq("user_id",user.id)
    .single();



    if(adminError || !admin){

        alert("Admin access denied");
        return;

    }



    document
    .getElementById("loginBox")
    .style.display="none";


    document
    .getElementById("dashboard")
    .style.display="block";


    loadPending();

}





async function loadPending(){


    const {data,error}
    =
    await window.supabaseClient
    .from("submissions")
    .select("*")
    .eq("status","pending")
    .order("id",{ascending:false});



    if(error){

        console.log(error);
        return;

    }



    const box =
    document.getElementById("pending");



    if(!data || data.length===0){

        box.innerHTML=
        "<p>কোনো Pending Submission নেই</p>";

        return;

    }



    box.innerHTML =
    data.map(item=>`

    <div class="item">

        <h3>${item.name}</h3>

        <p>
        ক্যাটাগরি: ${item.cat}
        </p>

        <p>
        সাব-ক্যাটাগরি: ${item.subcat}
        </p>

        <p>
        ফোন: ${item.phone}
        </p>

        <p>
        ঠিকানা: ${item.address}
        </p>

        <p>
        বিস্তারিত: ${item.description || ""}
        </p>


        <button class="approve"
        onclick="approveSubmission(${item.id})">
        Approve
        </button>


        <button class="reject"
        onclick="rejectSubmission(${item.id})">
        Reject
        </button>


    </div>

    `).join("");



}





async function approveSubmission(id){


    const {data:item,error}
    =
    await window.supabaseClient
    .from("submissions")
    .select("*")
    .eq("id",id)
    .single();



    if(error){

        console.log(error);
        alert("Submission পাওয়া যায়নি");
        return;

    }



    const {error:insertError}
    =
    await window.supabaseClient
    .from("directory_items")
    .insert({

        cat:item.cat,
        subcat:item.subcat,
        name:item.name,
        phone:item.phone,
        map_url:item.map_url,
        address:item.address,
        description:item.description

    });



    if(insertError){

        console.log(insertError);
        alert("Directory এ publish হয়নি");
        return;

    }





    const {error:updateError}
    =
    await window.supabaseClient
    .from("submissions")
    .update({

        status:"approved",
        reviewed_at:new Date()

    })
    .eq("id",id);



    if(updateError){

        console.log(updateError);
        alert("Status update হয়নি");
        return;

    }



    alert("Approved Successfully");


    loadPending();


}







async function rejectSubmission(id){



    const {error}
    =
    await window.supabaseClient
    .from("submissions")
    .update({

        status:"rejected",
        reviewed_at:new Date()

    })
    .eq("id",id);



    if(error){

        console.log(error);
        alert("Reject failed");
        return;

    }



    alert("Rejected");


    loadPending();


}
