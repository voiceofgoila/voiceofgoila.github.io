// Voice of Goila Admin Dashboard


let directoryData = [];


// =====================
// PAGE LOAD SESSION CHECK
// =====================

window.addEventListener("load", async ()=>{


const {data} =
await window.supabaseClient.auth.getSession();


if(data.session){

checkAdmin(data.session.user);

}


});



// =====================
// MENU
// =====================


function toggleMenu(){

let menu=document.getElementById("menu");


if(menu.style.display==="block"){

menu.style.display="none";

}
else{

menu.style.display="block";

}

}



function showDashboard(){

document.getElementById("menu").style.display="none";

}



function showDirectory(){

document.getElementById("menu").style.display="none";

document
.getElementById("directoryList")
.scrollIntoView();

}





// =====================
// LOGIN
// =====================


async function login(){


let email =
document.getElementById("email").value;


let password =
document.getElementById("password").value;



const {data,error}
=
await window.supabaseClient.auth
.signInWithPassword({

email,
password

});



if(error){

alert("Login Failed");
return;

}



checkAdmin(data.user);


}





// =====================
// ADMIN CHECK
// =====================


async function checkAdmin(user){


const {data:admin,error}

=
await window.supabaseClient
.from("admin_users")
.select("*")
.eq("user_id",user.id)
.single();



if(error || !admin){

alert("Admin Access Denied");

return;

}



document
.getElementById("loginBox")
.style.display="none";


document
.getElementById("dashboard")
.style.display="block";


loadAll();


}




// =====================
// LOGOUT
// =====================


async function logout(){


await window.supabaseClient.auth.signOut();


location.reload();


}




// =====================
// LOAD ALL
// =====================


function loadAll(){


loadPending();

loadDirectory();

loadStats();


}






// =====================
// PENDING
// =====================


async function loadPending(){



const {data,error}

=
await window.supabaseClient
.from("submissions")
.select("*")
.eq("status","pending")
.order("id",{ascending:false});



let box =
document.getElementById("pending");



document.getElementById("totalPending")
.innerText =
data ? data.length : 0;



if(!data || data.length===0){

box.innerHTML=
"কোনো Pending Submission নেই";

return;

}



box.innerHTML =
data.map(item=>`


<div class="item">


<h3>${item.name}</h3>


<p>
${item.cat}
</p>


<p>
${item.phone}
</p>


<p>
${item.address}
</p>



<button class="action approve"
onclick="approveSubmission(${item.id})">

Approve

</button>



<button class="action reject"
onclick="rejectSubmission(${item.id})">

Reject

</button>


</div>


`).join("");



}





// =====================
// APPROVE
// =====================


async function approveSubmission(id){


const {data:item}

=
await window.supabaseClient
.from("submissions")
.select("*")
.eq("id",id)
.single();



const {error}

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



if(error){

alert(error.message);
return;

}



await window.supabaseClient
.from("submissions")
.update({

status:"approved",
reviewed_at:new Date()

})
.eq("id",id);



alert("Approved");


loadAll();


}





// =====================
// REJECT
// =====================


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





// =====================
// DIRECTORY LOAD
// =====================


async function loadDirectory(){


const {data,error}

=
await window.supabaseClient
.from("directory_items")
.select("*")
.order("id",{ascending:false});



directoryData=data || [];


showDirectoryList(directoryData);



}




function showDirectoryList(data){


let box =
document.getElementById("directoryList");



document.getElementById("totalDirectory")
.innerText=data.length;



if(data.length===0){

box.innerHTML="No Data";

return;

}



box.innerHTML =
data.map(item=>`


<div class="item">


<h3>${item.name}</h3>


<p>
${item.cat}
</p>


<p>
${item.phone}
</p>


<p>
${item.address}
</p>



<button class="action edit"
onclick="editDirectory(${item.id})">

Edit

</button>



<button class="action delete"
onclick="deleteDirectory(${item.id})">

Delete

</button>



</div>


`).join("");



}





// =====================
// SEARCH
// =====================


function searchDirectory(){


let text =
document.getElementById("searchBox")
.value
.toLowerCase();



let result =
directoryData.filter(item=>

(item.name || "")
.toLowerCase()
.includes(text)

);



showDirectoryList(result);


}






// =====================
// EDIT
// =====================


function editDirectory(id){



let item =
directoryData.find(x=>x.id===id);



document.getElementById("editId").value=item.id;

document.getElementById("editName").value=item.name;

document.getElementById("editCat").value=item.cat;

document.getElementById("editSubcat").value=item.subcat;

document.getElementById("editPhone").value=item.phone;

document.getElementById("editAddress").value=item.address;

document.getElementById("editMap").value=item.map_url;



document.getElementById("editModal")
.style.display="flex";


}





// =====================
// UPDATE
// =====================


async function updateDirectory(){


let id =
document.getElementById("editId").value;



await window.supabaseClient
.from("directory_items")
.update({

name:
document.getElementById("editName").value,

cat:
document.getElementById("editCat").value,

subcat:
document.getElementById("editSubcat").value,

phone:
document.getElementById("editPhone").value,

address:
document.getElementById("editAddress").value,

map_url:
document.getElementById("editMap").value

})
.eq("id",id);



document.getElementById("editModal")
.style.display="none";


alert("Updated");


loadDirectory();


}





// =====================
// DELETE
// =====================


async function deleteDirectory(id){


if(!confirm("Delete this item?")){

return;

}



await window.supabaseClient
.from("directory_items")
.delete()
.eq("id",id);



alert("Deleted");


loadDirectory();


}





// =====================
// STATS
// =====================


async function loadStats(){


const {data}

=
await window.supabaseClient
.from("submissions")
.select("*")
.eq("status","approved");



document.getElementById("totalApproved")
.innerText =
data ? data.length : 0;


}
