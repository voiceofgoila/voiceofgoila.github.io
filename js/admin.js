// Voice of Goila Admin Panel

async function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const {data, error} = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });


    if(error){
        alert("Login Failed: " + error.message);
        return;
    }


    const user = data.user;


    // Check admin permission

    const {data: admin, error: adminError} = await window.supabaseClient
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .single();


    if(adminError || !admin){

        alert("You are not an admin");
        return;

    }


    document.getElementById("loginBox").style.display="none";

    document.getElementById("dashboard").style.display="block";


    loadPending();

}



async function loadPending(){

const {data,error}= await window.supabaseClient
.from("submissions")
.select("*")
.eq("status","pending");


if(error){

console.log(error);
return;

}


let box=document.getElementById("pending");


if(!data || data.length===0){

box.innerHTML="<p>No Pending Submission</p>";
return;

}


box.innerHTML=data.map(item=>`

<div>

<h3>${item.name}</h3>

<p>${item.cat}</p>

<p>${item.phone}</p>

<p>${item.address}</p>


<button onclick="approve(${item.id})">
Approve
</button>


<button onclick="reject(${item.id})">
Reject
</button>


</div>

<hr>


`).join("");

}




async function approve(id){


const {data:item}=await window.supabaseClient
.from("submissions")
.select("*")
.eq("id",id)
.single();



await window.supabaseClient
.from("directory_items")
.insert(item);



await window.supabaseClient
.from("submissions")
.update({
status:"approved"
})
.eq("id",id);



alert("Approved");

loadPending();


}




async function reject(id){


await window.supabaseClient
.from("submissions")
.update({
status:"rejected"
})
.eq("id",id);


alert("Rejected");

loadPending();


       }
