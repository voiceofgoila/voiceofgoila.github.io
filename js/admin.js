// Voice of Goila Admin
// Final Stable Version


let directoryData = [];

let selectedImageFile = null;





// ===============================
// PAGE LOAD
// ===============================


window.onload = async function(){


const {data,error}=

await window.supabaseClient.auth.getSession();



if(error){

console.log(error);

}




if(data.session){

checkAdmin(data.session.user);

}



};









async function login(){

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;


const {data,error}=await window.supabaseClient.auth.signInWithPassword({

email:email,

password:password

});


if(error){

alert(error.message);

return;

}


document.getElementById("loginBox").style.display="none";

document.getElementById("dashboard").style.display="block";

loadAll();


}







// ===============================
// CHECK ADMIN
// ===============================

async function checkAdmin(user){



console.log("Current User:", user.id);



const {data,error}=

await window.supabaseClient

.from("admin_users")

.select("user_id")

.eq("user_id", user.id)

.maybeSingle();





if(error){

console.log(error);

alert("Admin checking error");

return;

}





if(!data){

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


const menu=

document.getElementById("menu");



if(menu.style.display==="block"){


menu.style.display="none";


}

else{


menu.style.display="block";


}



}





function showDashboard(){


document

.getElementById("dashboard")

.style.display="block";


}





function showDirectory(){


document

.getElementById("directory")

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
// DASHBOARD STATS
// ===============================


async function loadStats(){



const total =

await window.supabaseClient

.from("directory_items")

.select("*",

{
count:"exact",
head:true
});






const pending =

await window.supabaseClient

.from("submissions")

.select("*",

{
count:"exact",
head:true
})

.eq("status","pending");






const approved =

await window.supabaseClient

.from("directory_items")

.select("*",

{
count:"exact",
head:true
});







document.getElementById("total").innerText =

total.count || 0;




document.getElementById("pendingCount").innerText =

pending.count || 0;




document.getElementById("approvedCount").innerText =

approved.count || 0;



}









// ===============================
// IMAGE PREVIEW
// ===============================


function previewImage(event){


const file =

event.target.files[0];



if(!file)

return;




selectedImageFile=file;




const img=

document.getElementById("imagePreview");



img.src=

URL.createObjectURL(file);



img.style.display="block";



}

// ===============================
// IMAGE COMPRESS 1:1 FORMAT
// ===============================


function compressImage(file){


return new Promise((resolve)=>{


const img = new Image();



img.onload=function(){



const size = 500;



const canvas =
document.createElement("canvas");



canvas.width=size;

canvas.height=size;



const ctx =
canvas.getContext("2d");




// center crop

let minSize =
Math.min(
img.width,
img.height
);



let startX =
(img.width-minSize)/2;


let startY =
(img.height-minSize)/2;





ctx.drawImage(

img,

startX,

startY,

minSize,

minSize,

0,

0,

size,

size

);






canvas.toBlob(

function(blob){


resolve(blob);


},

"image/jpeg",

0.70


);



};





img.src =
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
"_image.jpg";





const {error}=

await window.supabaseClient

.storage

.from("image")

.upload(

fileName,

compressed,

{

contentType:"image/jpeg",

upsert:false

}

);






if(error){

console.log("SUPABASE UPLOAD ERROR:", error);

alert(error.message);

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

console.log("UPLOAD CATCH ERROR:", e);

alert(e.message);

return null;

}



}









// ===============================
// EDIT IMAGE NAME + PREVIEW
// ===============================


function showEditImage(event){


const file =

event.target.files[0];



const name =

document.getElementById("editImageName");



const preview =

document.getElementById("editImagePreview");




if(file){



name.innerHTML =

"Selected Image: " + file.name;



preview.src =

URL.createObjectURL(file);



preview.style.display="block";



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

.order("id",
{
ascending:false
});






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







box.innerHTML = data.map(item=>`


<div class="item">


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







let imageUrl = "";






if(selectedImageFile){


imageUrl =

await uploadImage(selectedImageFile)

|| "";



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

console.log(insertError);

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



document.getElementById("submissionImage").value="";


document.getElementById("imagePreview").style.display="none";



loadAll();



}









// ===============================
// REJECT SUBMISSION
// ===============================


async function rejectSubmission(id){



const {error}=

await window.supabaseClient

.from("submissions")

.update({

status:"rejected",

reviewed_at:new Date()

})

.eq("id",id);






if(error){

alert(error.message);

return;

}





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

.order("id",
{
ascending:false
});





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



${item.image_url ? `

<img src="${item.image_url}"

style="
width:100%;
max-height:200px;
object-fit:cover;
border-radius:12px;
">

`:""}



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





box.innerHTML = `

<option value="">
Select Category
</option>

`;





data.forEach(cat=>{


box.innerHTML += `

<option value="${cat.name}">
${cat.name}
</option>

`;



});





if(selected){

box.value = selected;

}



}









// ===============================
// SUB CATEGORY LOAD
// ===============================


async function changeSubCategory(selected=""){



const category =

document.getElementById("editCat").value;




const box =

document.getElementById("editSubcat");




box.innerHTML = `

<option value="">
Select Sub Category
</option>

`;





if(!category)

return;







const {data:cat,error}=

await window.supabaseClient

.from("categories")

.select("id")

.eq("name",category)

.single();





if(error || !cat)

return;







const {data,error:subError}=

await window.supabaseClient

.from("sub_categories")

.select("*")

.eq("category_id",cat.id)

.order("id");






if(subError){

console.log(subError);

return;

}







data.forEach(sub=>{


box.innerHTML += `

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

directoryData.find(x=>x.id==id);





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






const img=

document.getElementById("editImagePreview");



if(item.image_url){


img.src=item.image_url;

img.style.display="block";


}

else{


img.style.display="none";


}






document.getElementById("editImageName").innerHTML=

"No image selected";





document.getElementById("editModal")
.style.display="flex";



}









// ===============================
// CLOSE EDIT
// ===============================


function closeEditModal(){


document.getElementById("editModal")
.style.display="none";



}









// ===============================
// UPDATE DIRECTORY
// ===============================


async function updateDirectory(){



const id =

document.getElementById("editId").value;






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







const imageFile =

document.getElementById("editImage").files[0];







if(imageFile){



const newImage =

await uploadImage(imageFile);





if(newImage){

updateData.image_url=newImage;

}



}

else{



const oldItem =

directoryData.find(x=>x.id==id);





if(oldItem && oldItem.image_url){


updateData.image_url =
oldItem.image_url;


}



}









const {error}=

await window.supabaseClient

.from("directory_items")

.update(updateData)

.eq("id",id);







if(error){


alert(error.message);

console.log(error);

return;


}







alert("Updated Successfully");



closeEditModal();



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







alert("Deleted Successfully");



loadAll();



             }
