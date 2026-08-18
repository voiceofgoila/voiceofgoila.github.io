// Voice of Goila Admin Dashboard System


let directoryData = [];


// ===============================
// PAGE LOAD - CHECK SESSION
// ===============================


window.addEventListener("load", async ()=>{


    const {data} =
    await window.supabaseClient.auth.getSession();


    if(data.session){

        checkAdmin(data.session.user);

    }


});




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
return;

}


checkAdmin(data.user);


}




// ===============================
// ADMIN CHECK
// ===============================


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




// ===============================
// LOGOUT
// ===============================


async function logout(){


await window.supabaseClient.auth.signOut();


location.reload();


}





// ===============================
// LOAD EVERYTHING
// ===============================


async function loadAll(){


loadPending();

loadDirectory();

updateStats();


}





// ===============================
// PENDING SUBMISSION
// ===============================


async function loadPending(){



const {data,error}

=
await window.supabaseClient
.from("submissions")
.select("*")
.eq("status","pending")
.order("id",{ascending:false});



const box =
document.getElementById("pending");



document.getElementById("totalPending")
.innerText =
data ? data.length : 0;



if(!data || data.length===0){


box.innerHTML=
"<p>কোনো Pending Submission নেই</p>";

return;

}



box.innerHTML =
data.map(item=>`


<div class="item">


<h3>${item.name}</h3>


<p>Category: ${item.cat}</p>

<p>Sub Category: ${item.subcat}</p>

<p>Phone: ${item.phone}</p>

<p>Address: ${item.address}</p>



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
// APPROVE
// ===============================


async function approveSubmission(id){



const {data:item}

=
await window.supabaseClient
.from("submissions")
.select("*")
.eq("id",id)
.single();



await window.supabaseClient
.from("directory_items")
.insert({

cat:item.cat,
subcat:item.subcat,
name:item.name,
phone:item.phone,
map_url:item.map_url,
address:item.address

});



await window.supabaseClient
.from("submissions")
.update({

status:"approved",
reviewed_at:new Date()

})
.eq("id",id);



alert("Approved Successfully");


loadAll();


}






// ===============================
// REJECT
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


loadAll();


}





// ===============================
// LOAD DIRECTORY
// ===============================


async function loadDirectory(){



const {data,error}

=
await window.supabaseClient
.from("directory_items")
.select("*")
.order("id",{ascending:false});



directoryData=data || [];



showDirectory(directoryData);



document.getElementById("totalDirectory")
.innerText=
directoryData.length;



}





function showDirectory(data){


const box =
document.getElementById("directoryList");



if(data.length===0){

box.innerHTML=
"No Data";

return;

}



box.innerHTML =

data.map(item=>`


<div class="item">


<h3>${item.name}</h3>


<p>${item.cat}</p>

<p>${item.address}</p>



<button class="edit"
onclick="editDirectory(${item.id})">
Edit
</button>



<button class="delete"
onclick="deleteDirectory(${item.id})">
Delete
</button>



</div>


`).join("");



}





// ===============================
// SEARCH
// ===============================


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



showDirectory(result);


}





// ===============================
// EDIT
// ===============================


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




// ===============================
// UPDATE
// ===============================


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



alert("Updated Successfully");


loadDirectory();


}





// ===============================
// DELETE
// ===============================


async function deleteDirectory(id){



if(!confirm("Delete this information?")){

return;

}



await window.supabaseClient
.from("directory_items")
.delete()
.eq("id",id);



alert("Deleted");


loadDirectory();


}





// ===============================
// STATS
// ===============================


async function updateStats(){



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
