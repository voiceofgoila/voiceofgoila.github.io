// Voice of Goila Admin System
// Final Version With Image Upload


let directoryData = [];

let selectedImageFile = null;



// ===============================
// PAGE LOAD
// ===============================

window.onload = async function(){


    const {data}=
    await window.supabaseClient.auth.getSession();



    if(data.session){

        checkAdmin(data.session.user);

    }


};





// ===============================
// LOGIN
// ===============================


async function login(){


const email =
document.getElementById("email").value;



const password =
document.getElementById("password").value;



const {data,error}=

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
// CHECK ADMIN
// ===============================


async function checkAdmin(user){



const {data,error}=

await window.supabaseClient

.from("admin_users")

.select("*")

.eq("user_id",user.id)

.single();



if(error || !data){

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





function showDashboard(){

document.getElementById("dashboard")
.style.display="block";

}



function showDirectory(){

document.getElementById("directory")
.scrollIntoView();

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
// IMAGE PREVIEW
// ===============================


function previewImage(event){


const file = event.target.files[0];


if(!file)
return;



selectedImageFile=file;



const preview =
document.getElementById("imagePreview");



preview.src =
URL.createObjectURL(file);



preview.style.display="block";


}








// ===============================
// IMAGE COMPRESS
// ===============================


function compressImage(file){


return new Promise((resolve)=>{


const img=new Image();


img.onload=function(){



const canvas=document.createElement("canvas");


let width=800;


let height=
(img.height/img.width)*width;



canvas.width=width;

canvas.height=height;



const ctx=
canvas.getContext("2d");



ctx.drawImage(
img,
0,
0,
width,
height
);



canvas.toBlob(

(blob)=>{


resolve(blob);


},

"image/jpeg",

0.75


);



};



img.src=
URL.createObjectURL(file);



});

}








// ===============================
// UPLOAD IMAGE
// ===============================


async function uploadImage(file){



if(!file)
return null;



try{


const compressed =
await compressImage(file);



const fileName =

Date.now()
+
".jpg";



const {error}=

await window.supabaseClient

.storage

.from("images")

.upload(

fileName,

compressed,

{

contentType:"image/jpeg"

}

);



if(error){


console.log(error);

return null;


}




const {data}=

window.supabaseClient

.storage

.from("images")

.getPublicUrl(fileName);



return data.publicUrl;



}

catch(e){


console.log(e);

return null;


}


}








// ===============================
// LOAD PENDING
// ===============================


async function loadPending(){



const {data,error}=

await window.supabaseClient

.from("submissions")

.select("*")

.eq("status","pending")

.order(
"id",
{
ascending:false
}

);





if(error){

console.log(error);

return;

}





const box =
document.getElementById("pending");



if(!box)
return;





if(!data || data.length===0){


box.innerHTML=
"<p>কোনো Pending Submission নেই</p>";

return;


}







box.innerHTML=data.map(item=>`



<div class="item">


<h3>
${item.name}
</h3>



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
ঠিকানা: ${item.address || ""}
</p>




<button 
class="approve"

onclick="approveSubmission(${item.id})">

Approve

</button>



<button

class="reject"

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






let imageUrl=null;



if(selectedImageFile){


imageUrl =
await uploadImage(selectedImageFile);


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


description:item.description,


image_url:imageUrl



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



selectedImageFile=null;



loadAll();



}

// ===============================
// REJECT SUBMISSION
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



const {data,error}=

await window.supabaseClient

.from("directory_items")

.select("*")

.order(
"id",
{
ascending:false
}
);




if(error){

console.log(error);

return;

}





directoryData=data || [];



displayDirectory(directoryData);



}







// ===============================
// DISPLAY DIRECTORY
// ===============================


function displayDirectory(data){



const box =
document.getElementById("directory");



if(!box)
return;





if(!data || data.length===0){


box.innerHTML=
"<p>No Data Found</p>";


return;


}





box.innerHTML=data.map(item=>`



<div class="item">



${item.image_url ?


`

<img src="${item.image_url}"

style="
width:100%;
max-height:200px;
object-fit:cover;
border-radius:12px;
">

`

:""

}



<h3>

${item.name || ""}

</h3>



<p>

ক্যাটাগরি:
${item.cat || ""}

</p>



<p>

সাব-ক্যাটাগরি:
${item.subcat || ""}

</p>



<p>

ফোন:
${item.phone || ""}

</p>



<p>

ঠিকানা:
${item.address || ""}

</p>





<button

class="edit"

onclick="editDirectory(${item.id})">

Edit

</button>




<button

class="delete"

onclick="deleteDirectory(${item.id})">

Delete

</button>



</div>



`).join("");



}








// ===============================
// CATEGORY LOAD
// ===============================


async function loadCategories(selected=""){



const {data,error}=

await window.supabaseClient

.from("categories")

.select("*")

.order("id");




if(error){

console.log(error);

return;

}



const box =
document.getElementById("editCat");



if(!box)
return;




box.innerHTML=

`
<option value="">
Category Select
</option>
`;




data.forEach(cat=>{


box.innerHTML +=`

<option value="${cat.name}">

${cat.name}

</option>

`;


});





if(selected){

box.value=selected;

}



}









// ===============================
// SUB CATEGORY LOAD
// ===============================


async function changeSubCategory(selected=""){



const catName =

document.getElementById("editCat")
.value;



const box =

document.getElementById("editSubcat");



box.innerHTML=

`
<option value="">
Sub Category Select
</option>
`;





if(!catName)
return;





const {data:cat}=

await window.supabaseClient

.from("categories")

.select("id")

.eq("name",catName)

.single();





if(!cat)
return;





const {data,error}=

await window.supabaseClient

.from("sub_categories")

.select("*")

.eq("category_id",cat.id)

.order("id");





if(error){

console.log(error);

return;

}






data.forEach(sub=>{


box.innerHTML +=`

<option value="${sub.name}">

${sub.name}

</option>

`;


});





if(selected){

box.value=selected;

}



}









// ===============================
// EDIT DIRECTORY
// ===============================


async function editDirectory(id){



const item =

directoryData.find(x=>x.id===id);




if(!item)
return;





document.getElementById("editId").value=item.id;



document.getElementById("editName").value=item.name || "";



await loadCategories(item.cat);



await changeSubCategory(item.subcat);




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



let imageUrl=null;



const imageFile =

document.getElementById("editImage")
.files[0];




if(imageFile){

imageUrl =
await uploadImage(imageFile);

}







let updateData={



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


};





if(imageUrl){

updateData.image_url=imageUrl;

}






const {error}=

await window.supabaseClient

.from("directory_items")

.update(updateData)

.eq("id",id);






if(error){

alert(error.message);

return;

}





alert("Updated Successfully");



document.getElementById("editModal")
.style.display="none";



loadDirectory();



}









// ===============================
// DELETE
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



loadAll();


}
