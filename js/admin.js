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
// ===============================
// APPROVE SUBMISSION
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



const {error:insertError}=

await window.supabaseClient

.from("directory_items")

.insert({

name:item.name,

cat:item.cat,

subcat:item.subcat,

phone:item.phone,

address:item.address,

map_url:item.map_url,

description:item.description

});



if(insertError){

alert(insertError.message);

return;

}



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


loadPending();


}






// ===============================
// LOAD DIRECTORY
// ===============================


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



directoryData=data || [];


displayDirectory(directoryData);


}






function displayDirectory(data){


const box =
document.getElementById("directory");



if(!data || data.length===0){

box.innerHTML="No Data";

return;

}



box.innerHTML=data.map(item=>`


<div class="item">


<h3>
${item.name}
</h3>



<p>
Category: ${item.cat || ""}
</p>



<p>
Sub Category: ${item.subcat || ""}
</p>



<p>
Phone: ${item.phone || ""}
</p>



<p>
Address: ${item.address || ""}
</p>



<button class="edit action"
onclick="editDirectory(${item.id})">

Edit

</button>



<button class="delete action"
onclick="deleteDirectory(${item.id})">

Delete

</button>



</div>


`).join("");



}







// ===============================
// SEARCH
// ===============================


document.addEventListener("keyup",function(e){


const box =
document.getElementById("searchBox");



if(!box)
return;



let text =
box.value.toLowerCase();



let result =
directoryData.filter(item=>


(item.name || "")
.toLowerCase()
.includes(text)



);



displayDirectory(result);



});







// ===============================
// DYNAMIC CATEGORY LOAD
// ===============================


async function loadCategories(){



const {data,error}=

await window.supabaseClient

.from("categories")

.select("*")

.order("id");



if(error){

console.log(error);

return;

}



const catBox =
document.getElementById("editCat");



catBox.innerHTML =
`
<option value="">
Category Select
</option>
`;



data.forEach(cat=>{


catBox.innerHTML +=`

<option value="${cat.name}">
${cat.name}
</option>

`;


});


}







// ===============================
// LOAD SUB CATEGORY
// ===============================


async function changeSubCategory(){


const category =

document.getElementById("editCat").value;



const subBox =

document.getElementById("editSubcat");



subBox.innerHTML =
`
<option>
Sub Category Select
</option>
`;



if(!category)
return;



const {data:catData}=

await window.supabaseClient

.from("categories")

.select("id")

.eq("name",category)

.single();



if(!catData)
return;




const {data,error}=

await window.supabaseClient

.from("sub_categories")

.select("*")

.eq("category_id",catData.id)

.order("id");



if(error){

console.log(error);

return;

}




data.forEach(item=>{


subBox.innerHTML +=`

<option value="${item.name}">
${item.name}
</option>

`;


});


}







// ===============================
// EDIT DIRECTORY
// ===============================


async function editDirectory(id){


const item =

directoryData.find(x=>x.id===id);



if(!item)
return;



await loadCategories();



document.getElementById("editId").value=item.id;


document.getElementById("editName").value=item.name || "";


document.getElementById("editCat").value=item.cat || "";


await changeSubCategory();


document.getElementById("editSubcat").value=item.subcat || "";


document.getElementById("editPhone").value=item.phone || "";


document.getElementById("editAddress").value=item.address || "";


document.getElementById("editMap").value=item.map_url || "";


document.getElementById("editDescription").value=item.description || "";



document.getElementById("editModal")
.style.display="flex";


}







// ===============================
// UPDATE DIRECTORY
// ===============================


async function updateDirectory(){



const id =
document.getElementById("editId").value;



const {error}=

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
document.getElementById("editMap").value,


description:
document.getElementById("editDescription").value


})

.eq("id",id);




if(error){

alert(error.message);

return;

}



document.getElementById("editModal")
.style.display="none";



alert("Updated Successfully");


loadDirectory();


}







// ===============================
// DELETE DIRECTORY
// ===============================


async function deleteDirectory(id){


if(!confirm("Delete করতে চান?"))

return;



const {error}=

await window.supabaseClient

.from("directory_items")

.delete()

.eq("id",id);



if(error){

alert(error.message);

return;

}



alert("Deleted");


loadDirectory();


       }
