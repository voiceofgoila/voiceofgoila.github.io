// Voice of Goila Admin
// Final Stable Version


let directoryData = [];

let selectedImageFile = null;

let managedCategories = [];
let managedSubCategories = [];
let websiteSettingsRecord = null;





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


function showCategories(){

const section=document.getElementById("categoryManagement");
if(section) section.scrollIntoView({behavior:"smooth",block:"start"});

}

function showWebsiteSettings(){
    const section=document.getElementById("websiteSettingsManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
}










// ===============================
// LOAD ALL
// ===============================


function loadAll(){


loadStats();

loadPending();

loadDirectory();

loadCategoryManager();
loadWebsiteSettings();


}









// ===============================
// DASHBOARD STATS
// ===============================


async function loadStats(){

const [total,pending,approved,categoriesCount,subCategoriesCount] = await Promise.all([
    window.supabaseClient.from("directory_items").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("submissions").select("*",{count:"exact",head:true}).eq("status","pending"),
    window.supabaseClient.from("submissions").select("*",{count:"exact",head:true}).eq("status","approved"),
    window.supabaseClient.from("categories").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("sub_categories").select("*",{count:"exact",head:true})
]);

const setCount=(id,result)=>{
    const el=document.getElementById(id);
    if(el) el.innerText = result && !result.error ? (result.count || 0) : 0;
};

setCount("total",total);
setCount("pendingCount",pending);
setCount("approvedCount",approved);
setCount("categoryCount",categoriesCount);
setCount("subCategoryCount",subCategoriesCount);

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

.from("image")

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

const exists = Array.from(box.options).some(option => option.value === selected);

if(!exists){
box.innerHTML += `<option value="${selected}">${selected}</option>`;
}

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





if(error || !cat){

if(selected){
box.innerHTML += `<option value="${selected}">${selected}</option>`;
box.value=selected;
}

return;
}







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

const exists = Array.from(box.options).some(option => option.value === selected);

if(!exists){
box.innerHTML += `<option value="${selected}">${selected}</option>`;
}

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



// ===============================
// CATEGORY / SUBCATEGORY MANAGER
// ===============================

function cmsEscape(value){
    return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function normalizeCmsName(value){
    return String(value || "").trim().replace(/\s+/g," ");
}

async function loadCategoryManager(){
    const categoryList=document.getElementById("categoryList");
    const subList=document.getElementById("subCategoryList");

    if(categoryList) categoryList.innerHTML="Loading...";
    if(subList) subList.innerHTML="Loading...";

    const [catRes,subRes]=await Promise.all([
        window.supabaseClient.from("categories").select("*").order("id",{ascending:true}),
        window.supabaseClient.from("sub_categories").select("*").order("id",{ascending:true})
    ]);

    if(catRes.error){
        console.error(catRes.error);
        if(categoryList) categoryList.innerHTML="<p>Category load failed</p>";
        return;
    }

    if(subRes.error){
        console.error(subRes.error);
        if(subList) subList.innerHTML="<p>Subcategory load failed</p>";
        return;
    }

    managedCategories=catRes.data || [];
    managedSubCategories=subRes.data || [];

    renderManagedCategories();
    renderManagedSubcategories();
    fillManagedCategorySelects();
}

function renderManagedCategories(){
    const box=document.getElementById("categoryList");
    if(!box) return;

    if(!managedCategories.length){
        box.innerHTML="<p>কোনো Category নেই</p>";
        return;
    }

    box.innerHTML=managedCategories.map(cat=>{
        const childCount=managedSubCategories.filter(sub=>String(sub.category_id)===String(cat.id)).length;
        return `
        <div class="cms-row">
            <div>
                <strong>${cmsEscape(cat.name)}</strong>
                <span class="cms-parent">${childCount} subcategory</span>
            </div>
            <button class="edit" onclick="openCategoryManagerEdit('category',${Number(cat.id)})">Edit</button>
            <button class="delete" onclick="deleteManagedCategory(${Number(cat.id)})">Delete</button>
        </div>`;
    }).join("");
}

function renderManagedSubcategories(){
    const box=document.getElementById("subCategoryList");
    if(!box) return;

    if(!managedSubCategories.length){
        box.innerHTML="<p>কোনো Subcategory নেই</p>";
        return;
    }

    const categoryMap=new Map(managedCategories.map(cat=>[String(cat.id),cat.name]));

    box.innerHTML=managedSubCategories.map(sub=>`
        <div class="cms-row">
            <div>
                <strong>${cmsEscape(sub.name)}</strong>
                <span class="cms-parent">${cmsEscape(categoryMap.get(String(sub.category_id)) || "Unknown Category")}</span>
            </div>
            <button class="edit" onclick="openCategoryManagerEdit('subcategory',${Number(sub.id)})">Edit</button>
            <button class="delete" onclick="deleteManagedSubcategory(${Number(sub.id)})">Delete</button>
        </div>
    `).join("");
}

function fillManagedCategorySelects(selectedId=""){
    const optionHtml=[
        '<option value="">Parent Category নির্বাচন করুন</option>',
        ...managedCategories.map(cat=>`<option value="${Number(cat.id)}">${cmsEscape(cat.name)}</option>`)
    ].join("");

    const addSelect=document.getElementById("subCategoryParent");
    if(addSelect){
        const current=addSelect.value;
        addSelect.innerHTML=optionHtml;
        if(current && managedCategories.some(cat=>String(cat.id)===String(current))) addSelect.value=current;
    }

    const editSelect=document.getElementById("categoryManagerParent");
    if(editSelect){
        editSelect.innerHTML=optionHtml;
        if(selectedId) editSelect.value=String(selectedId);
    }
}

async function addManagedCategory(){
    const input=document.getElementById("newCategoryName");
    const name=normalizeCmsName(input ? input.value : "");

    if(!name){
        alert("Category নাম লিখুন");
        return;
    }

    if(managedCategories.some(cat=>String(cat.name).trim().toLowerCase()===name.toLowerCase())){
        alert("এই Category আগে থেকেই আছে");
        return;
    }

    const {error}=await window.supabaseClient.from("categories").insert({name});
    if(error){
        console.error(error);
        alert("Category যোগ করা যায়নি: "+error.message);
        return;
    }

    if(input) input.value="";
    await loadCategoryManager();
    await loadStats();
    alert("Category যোগ হয়েছে");
}

async function addManagedSubcategory(){
    const parent=document.getElementById("subCategoryParent");
    const input=document.getElementById("newSubCategoryName");
    const categoryId=parent ? parent.value : "";
    const name=normalizeCmsName(input ? input.value : "");

    if(!categoryId){
        alert("Parent Category নির্বাচন করুন");
        return;
    }

    if(!name){
        alert("Subcategory নাম লিখুন");
        return;
    }

    if(managedSubCategories.some(sub=>String(sub.category_id)===String(categoryId) && String(sub.name).trim().toLowerCase()===name.toLowerCase())){
        alert("এই Category-তে Subcategory-টি আগে থেকেই আছে");
        return;
    }

    const {error}=await window.supabaseClient.from("sub_categories").insert({
        category_id:Number(categoryId),
        name
    });

    if(error){
        console.error(error);
        alert("Subcategory যোগ করা যায়নি: "+error.message);
        return;
    }

    if(input) input.value="";
    await loadCategoryManager();
    await loadStats();
    alert("Subcategory যোগ হয়েছে");
}

function openCategoryManagerEdit(type,id){
    const modal=document.getElementById("categoryManagerModal");
    const typeInput=document.getElementById("categoryManagerType");
    const idInput=document.getElementById("categoryManagerId");
    const nameInput=document.getElementById("categoryManagerName");
    const title=document.getElementById("categoryManagerTitle");
    const parentWrap=document.getElementById("categoryManagerParentWrap");

    if(!modal || !typeInput || !idInput || !nameInput) return;

    typeInput.value=type;
    idInput.value=String(id);

    if(type==="category"){
        const item=managedCategories.find(cat=>String(cat.id)===String(id));
        if(!item) return;
        if(title) title.innerText="Edit Category";
        if(parentWrap) parentWrap.style.display="none";
        nameInput.value=item.name || "";
    }else{
        const item=managedSubCategories.find(sub=>String(sub.id)===String(id));
        if(!item) return;
        if(title) title.innerText="Edit Subcategory";
        if(parentWrap) parentWrap.style.display="block";
        fillManagedCategorySelects(item.category_id);
        nameInput.value=item.name || "";
    }

    modal.style.display="flex";
}

function closeCategoryManagerEdit(){
    const modal=document.getElementById("categoryManagerModal");
    if(modal) modal.style.display="none";
}

async function countExact(table,column,value){
    const {count,error}=await window.supabaseClient
        .from(table)
        .select("*",{count:"exact",head:true})
        .eq(column,value);
    if(error) throw error;
    return count || 0;
}

async function categoryIsUsed(name){
    const [directoryCount,submissionCount]=await Promise.all([
        countExact("directory_items","cat",name),
        countExact("submissions","cat",name)
    ]);
    return directoryCount + submissionCount;
}

async function subcategoryIsUsed(name){
    const [directoryCount,submissionCount]=await Promise.all([
        countExact("directory_items","subcat",name),
        countExact("submissions","subcat",name)
    ]);
    return directoryCount + submissionCount;
}

async function saveCategoryManagerEdit(){
    const type=document.getElementById("categoryManagerType").value;
    const id=document.getElementById("categoryManagerId").value;
    const name=normalizeCmsName(document.getElementById("categoryManagerName").value);

    if(!name){
        alert("নাম লিখুন");
        return;
    }

    try{
        if(type==="category"){
            const item=managedCategories.find(cat=>String(cat.id)===String(id));
            if(!item) return;

            const duplicate=managedCategories.some(cat=>String(cat.id)!==String(id) && String(cat.name).trim().toLowerCase()===name.toLowerCase());
            if(duplicate){
                alert("এই Category নাম আগে থেকেই আছে");
                return;
            }

            if(name!==item.name){
                const used=await categoryIsUsed(item.name);
                if(used>0){
                    alert(`এই Category ${used}টি Directory/Submission-এ ব্যবহৃত হচ্ছে। Data mismatch এড়াতে Rename block করা হয়েছে।`);
                    return;
                }
            }

            const {error}=await window.supabaseClient.from("categories").update({name}).eq("id",Number(id));
            if(error) throw error;
        }else{
            const item=managedSubCategories.find(sub=>String(sub.id)===String(id));
            if(!item) return;

            const categoryId=document.getElementById("categoryManagerParent").value;
            if(!categoryId){
                alert("Parent Category নির্বাচন করুন");
                return;
            }

            const duplicate=managedSubCategories.some(sub=>
                String(sub.id)!==String(id) &&
                String(sub.category_id)===String(categoryId) &&
                String(sub.name).trim().toLowerCase()===name.toLowerCase()
            );
            if(duplicate){
                alert("এই Parent Category-তে একই Subcategory আগে থেকেই আছে");
                return;
            }

            if(name!==item.name || String(categoryId)!==String(item.category_id)){
                const used=await subcategoryIsUsed(item.name);
                if(used>0){
                    alert(`এই Subcategory ${used}টি Directory/Submission-এ ব্যবহৃত হচ্ছে। Data mismatch এড়াতে Edit block করা হয়েছে।`);
                    return;
                }
            }

            const {error}=await window.supabaseClient.from("sub_categories").update({
                name,
                category_id:Number(categoryId)
            }).eq("id",Number(id));
            if(error) throw error;
        }

        closeCategoryManagerEdit();
        await loadCategoryManager();
        await loadStats();
        alert("Update হয়েছে");
    }catch(error){
        console.error(error);
        alert("Update করা যায়নি: "+error.message);
    }
}

async function deleteManagedCategory(id){
    const item=managedCategories.find(cat=>String(cat.id)===String(id));
    if(!item) return;

    try{
        const childCount=managedSubCategories.filter(sub=>String(sub.category_id)===String(id)).length;
        if(childCount>0){
            alert(`এই Category-এর ${childCount}টি Subcategory আছে। আগে সেগুলো সরান/ডিলিট করুন।`);
            return;
        }

        const used=await categoryIsUsed(item.name);
        if(used>0){
            alert(`এই Category ${used}টি Directory/Submission-এ ব্যবহৃত হচ্ছে। Data নিরাপদ রাখতে Delete block করা হয়েছে।`);
            return;
        }

        if(!confirm(`"${item.name}" Category delete করবেন?`)) return;

        const {error}=await window.supabaseClient.from("categories").delete().eq("id",Number(id));
        if(error) throw error;

        await loadCategoryManager();
        await loadStats();
    }catch(error){
        console.error(error);
        alert("Category delete করা যায়নি: "+error.message);
    }
}

async function deleteManagedSubcategory(id){
    const item=managedSubCategories.find(sub=>String(sub.id)===String(id));
    if(!item) return;

    try{
        const used=await subcategoryIsUsed(item.name);
        if(used>0){
            alert(`এই Subcategory ${used}টি Directory/Submission-এ ব্যবহৃত হচ্ছে। Data নিরাপদ রাখতে Delete block করা হয়েছে।`);
            return;
        }

        if(!confirm(`"${item.name}" Subcategory delete করবেন?`)) return;

        const {error}=await window.supabaseClient.from("sub_categories").delete().eq("id",Number(id));
        if(error) throw error;

        await loadCategoryManager();
        await loadStats();
    }catch(error){
        console.error(error);
        alert("Subcategory delete করা যায়নি: "+error.message);
    }
}



// ===============================
// WEBSITE SETTINGS MANAGER
// ===============================

function settingsValue(id){
    const el=document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
}

function normalizeSettingsUrl(value){
    const v=String(value || "").trim();
    if(!v) return "";
    if(/^https?:\/\//i.test(v)) return v;
    return "https://"+v.replace(/^\/+/,"");
}

function setSettingsStatus(text,isError=false){
    const el=document.getElementById("websiteSettingsStatus");
    if(!el) return;
    el.textContent=text || "";
    el.style.color=isError ? "#b42318" : "#5d247c";
}

function setSettingsPreview(id,url){
    const img=document.getElementById(id);
    if(!img) return;
    if(url){
        img.src=url;
        img.style.display="block";
    }else{
        img.removeAttribute("src");
        img.style.display="none";
    }
}

function previewWebsiteAsset(event,previewId){
    const file=event.target.files && event.target.files[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){
        alert("শুধু image file দিন");
        event.target.value="";
        return;
    }
    if(file.size > 5*1024*1024){
        alert("Image 5 MB-এর মধ্যে রাখুন");
        event.target.value="";
        return;
    }
    setSettingsPreview(previewId,URL.createObjectURL(file));
}

async function loadWebsiteSettings(){
    const section=document.getElementById("websiteSettingsManagement");
    if(!section) return;

    setSettingsStatus("Loading...");
    const {data,error}=await window.supabaseClient
        .from("website_settings")
        .select("*")
        .order("id",{ascending:true})
        .limit(1);

    if(error){
        console.error("Website settings load error:",error);
        setSettingsStatus("Settings load হয়নি: "+error.message,true);
        return;
    }

    websiteSettingsRecord=(data && data[0]) ? data[0] : null;
    const row=websiteSettingsRecord || {};

    const values={
        settingSiteName:row.site_name || "Voice of Goila",
        settingPhone:row.phone || "",
        settingEmail:row.email || "",
        settingAddress:row.address || "",
        settingFacebook:row.facebook || "",
        settingYoutube:row.youtube || "",
        settingWhatsapp:row.whatsapp || ""
    };
    Object.entries(values).forEach(([id,value])=>{
        const el=document.getElementById(id);
        if(el) el.value=value;
    });

    setSettingsPreview("websiteLogoPreview",row.logo_url || "");
    setSettingsPreview("websiteFaviconPreview",row.favicon_url || "");
    setSettingsStatus(websiteSettingsRecord ? "Current settings loaded" : "এখনও settings save করা হয়নি");
}

async function uploadWebsiteAsset(file,type){
    if(!file) return "";
    const ext=(file.name.split(".").pop() || "png").replace(/[^a-zA-Z0-9]/g,"").toLowerCase() || "png";
    const safeType=type==="favicon" ? "favicon" : "logo";
    const path=`website/${safeType}_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;

    const {error}=await window.supabaseClient.storage
        .from("image")
        .upload(path,file,{cacheControl:"3600",upsert:false});
    if(error) throw error;

    const {data}=window.supabaseClient.storage
        .from("image")
        .getPublicUrl(path);
    return data && data.publicUrl ? data.publicUrl : "";
}

async function saveWebsiteSettings(){
    const siteName=settingsValue("settingSiteName");
    if(!siteName){
        alert("Website Name লিখুন");
        return;
    }

    const email=settingsValue("settingEmail");
    if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        alert("সঠিক Email দিন");
        return;
    }

    const logoInput=document.getElementById("settingLogoFile");
    const faviconInput=document.getElementById("settingFaviconFile");
    const logoFile=logoInput && logoInput.files ? logoInput.files[0] : null;
    const faviconFile=faviconInput && faviconInput.files ? faviconInput.files[0] : null;

    setSettingsStatus("Saving...");

    try{
        let logoUrl=(websiteSettingsRecord && websiteSettingsRecord.logo_url) || "";
        let faviconUrl=(websiteSettingsRecord && websiteSettingsRecord.favicon_url) || "";

        if(logoFile) logoUrl=await uploadWebsiteAsset(logoFile,"logo");
        if(faviconFile) faviconUrl=await uploadWebsiteAsset(faviconFile,"favicon");

        const payload={
            site_name:siteName,
            logo_url:logoUrl,
            favicon_url:faviconUrl,
            phone:settingsValue("settingPhone"),
            email,
            address:settingsValue("settingAddress"),
            facebook:normalizeSettingsUrl(settingsValue("settingFacebook")),
            youtube:normalizeSettingsUrl(settingsValue("settingYoutube")),
            whatsapp:settingsValue("settingWhatsapp")
        };

        let result;
        if(websiteSettingsRecord && websiteSettingsRecord.id!=null){
            result=await window.supabaseClient
                .from("website_settings")
                .update(payload)
                .eq("id",websiteSettingsRecord.id)
                .select()
                .single();
        }else{
            // Prefer database-generated identity/default when available.
            result=await window.supabaseClient
                .from("website_settings")
                .insert(payload)
                .select()
                .single();

            // Some older copies of this table may have a required id without a default.
            // In that case retry safely with id=1 because the table is currently empty.
            if(result.error && /id|null value|not-null/i.test(String(result.error.message || ""))){
                result=await window.supabaseClient
                    .from("website_settings")
                    .insert({id:1,...payload})
                    .select()
                    .single();
            }
        }

        if(result.error) throw result.error;
        websiteSettingsRecord=result.data;
        if(logoInput) logoInput.value="";
        if(faviconInput) faviconInput.value="";
        setSettingsPreview("websiteLogoPreview",websiteSettingsRecord.logo_url || "");
        setSettingsPreview("websiteFaviconPreview",websiteSettingsRecord.favicon_url || "");
        setSettingsStatus("Saved successfully ✓");
        alert("Website Settings save হয়েছে");
    }catch(error){
        console.error("Website settings save error:",error);
        setSettingsStatus("Save হয়নি: "+error.message,true);
        alert("Website Settings save করা যায়নি: "+error.message);
    }
}


// ===============================
// DIRECTORY SEARCH
// ===============================

document.addEventListener("input", function(e){

    if(e.target.id !== "searchBox") return;

    const q = String(e.target.value || "")
        .toLowerCase()
        .trim();

    if(!q){
        displayDirectory(directoryData);
        return;
    }

    const filtered = directoryData.filter(item => {
        const text = [
            item.name,
            item.cat,
            item.subcat,
            item.phone,
            item.address,
            item.description
        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

        return text.includes(q);
    });

    displayDirectory(filtered);
});

