// Voice of Goila Admin Final JS


// ===============================
// Session Check
// ===============================


window.onload = function(){

checkSession();

};




// ===============================
// Login
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




const user=data.user;



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



showDashboard();



}




// ===============================
// Keep Login After Refresh
// ===============================


async function checkSession(){



const {data}=

await window.supabaseClient.auth.getSession();



if(data.session){


const {

data:admin

}=

await window.supabaseClient

.from("admin_users")

.select("*")

.eq(
"user_id",
data.session.user.id
)

.single();



if(admin){


showDashboard();


}


}



}






// ===============================
// Dashboard Show
// ===============================



function showDashboard(){


document
.getElementById("loginBox")
.style.display="none";



document
.getElementById("dashboard")
.style.display="block";



loadStats();

loadPending();

loadDirectory();


}






// ===============================
// Menu
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







// ===============================
// Logout
// ===============================


async function logout(){


await window.supabaseClient.auth.signOut();


location.reload();


}






// ===============================
// Stats
// ===============================


async function loadStats(){



let total =
await window.supabaseClient

.from("directory_items")

.select("*",{count:"exact",head:true});



document
.getElementById("total")
.innerHTML =
total.count || 0;





let pending =
await window.supabaseClient

.from("submissions")

.select("*",{count:"exact",head:true})

.eq("status","pending");



document
.getElementById("pendingCount")
.innerHTML =
pending.count || 0;





let approved =
await window.supabaseClient

.from("submissions")

.select("*",{count:"exact",head:true})

.eq("status","approved");



document
.getElementById("approvedCount")
.innerHTML =
approved.count || 0;



}








// ===============================
// Pending Load
// ===============================



async function loadPending(){



const {data,error}=


await window.supabaseClient

.from("submissions")

.select("*")

.eq("status","pending")

.order("id",{ascending:false});



let box =
document.getElementById("pending");




if(error){

console.log(error);

return;

}




if(!data || data.length===0){


box.innerHTML=

"<p>কোনো Pending Submission নেই</p>";

return;


}




box.innerHTML = data.map(item=>`



<div class="item">


<h3>${item.name}</h3>


<p>
ক্যাটাগরি: ${item.cat}
</p>


<p>
সাব-ক্যাটাগরি: ${item.subcat}
</p>


<p>
ফোন: ${item.phone || ""}
</p>


<p>
ঠিকানা: ${item.address}
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








// ===============================
// Approve
// ===============================


async function approveSubmission(id){



const {data:item,error}=


await window.supabaseClient

.from("submissions")

.select("*")

.eq("id",id)

.single();





if(error){

console.log(error);

return;

}




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






await window.supabaseClient

.from("submissions")

.update({

status:"approved",

reviewed_at:new Date()

})

.eq("id",id);





alert("Approved Successfully");



loadPending();

loadDirectory();

loadStats();



}








// ===============================
// Reject
// ===============================


async function rejectSubmission(id){



await window.supabaseClient

.from("submissions")

.update({

status:"rejected",

reviewed_at:new Date()

})

.eq("id",id);



alert("Rejected");



loadPending();


}








// ===============================
// Directory Load
// ===============================



async function loadDirectory(){



const {data,error}=


await window.supabaseClient

.from("directory_items")

.select("*")

.order("id",{ascending:false});





let box=

document.getElementById("directory");




if(error){

console.log(error);

return;

}




box.innerHTML=data.map(item=>`



<div class="item">


<h3>
${item.name}
</h3>



<p>
${item.cat}
</p>


<p>
${item.subcat}
</p>



<p>
${item.address}
</p>



<button class="delete"
onclick="deleteDirectory(${item.id})">

Delete

</button>


</div>



`).join("");




}









// ===============================
// Delete Directory
// ===============================



async function deleteDirectory(id){


if(!confirm("Delete করতে চান?"))

return;



await window.supabaseClient

.from("directory_items")

.delete()

.eq("id",id);



alert("Deleted");


loadDirectory();

loadStats();



}
