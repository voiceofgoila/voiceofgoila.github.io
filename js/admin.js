// Voice of Goila Admin
// Final Stable Version


let directoryData = [];

let selectedImageFile = null;

let managedCategories = [];
let managedSubCategories = [];
let websiteSettingsRecord = null;
let adminAnnouncements = [];
let homepageSettingsRecord = null;
let adminAds = [];





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

function showHomepageCMS(){
    const section=document.getElementById("homepageCmsManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
}

function showAnnouncements(){
    const section=document.getElementById("announcementManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
}

function showAds(){
    const section=document.getElementById("adsManagement");
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
loadHomepageContent();
loadAnnouncementsAdmin();
loadAdsAdmin();


}









// ===============================
// DASHBOARD STATS
// ===============================


async function loadStats(){

const [total,pending,approved,categoriesCount,subCategoriesCount,announcementCount,adsCount] = await Promise.all([
    window.supabaseClient.from("directory_items").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("submissions").select("*",{count:"exact",head:true}).eq("status","pending"),
    window.supabaseClient.from("submissions").select("*",{count:"exact",head:true}).eq("status","approved"),
    window.supabaseClient.from("categories").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("sub_categories").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("announcements").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("ads").select("*",{count:"exact",head:true})
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
setCount("announcementCount",announcementCount);
setCount("adsCount",adsCount);

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
// PHASE 2 PART 3 - HOMEPAGE CMS
// ===============================

const HOMEPAGE_DEFAULTS={
    badge:"গৈলা ইউনিয়ন • ডিজিটাল তথ্য প্ল্যাটফর্ম",
    hero_lead:"গৈলার প্রয়োজনীয়",
    hero_highlight:"তথ্য ও সেবা",
    hero_tail:"এখন এক জায়গায়",
    hero_description:"স্থানীয় প্রতিষ্ঠান, জরুরি সেবা, শিক্ষা, স্বাস্থ্য, ব্যবসা, সরকারি সেবা ও গুরুত্বপূর্ণ স্থান সহজে খুঁজে নিন।",
    search_placeholder:"প্রতিষ্ঠান, সেবা বা জায়গার নাম লিখুন...",
    category_title:"সেবার বিভাগ",
    category_subtitle:"প্রয়োজনীয় বিভাগ বেছে নিন",
    emergency_title:"🚨 জরুরি সেবা",
    emergency_subtitle:"দ্রুত যোগাযোগ",
    announcement_title:"📢 গুরুত্বপূর্ণ ঘোষণা",
    announcement_subtitle:"প্রয়োজনীয় তথ্য ও জনসচেতনতা",
    submit_title:"➕ তথ্য যোগ করুন",
    submit_subtitle:"এলাকার তথ্য সমৃদ্ধ করতে সাহায্য করুন",
    submit_body:"প্রতিষ্ঠান, দোকান, ব্যক্তি, ব্লাড ডোনার বা গুরুত্বপূর্ণ স্থানের প্রয়োজনীয় তথ্য খসড়া হিসেবে যোগ করুন।",
    submit_button:"তথ্য যোগ করুন"
};

function homepageStatus(text,isError=false){
    const el=document.getElementById("homepageCmsStatus");
    if(!el) return;
    el.textContent=text || "";
    el.style.color=isError ? "#b42318" : "#5d247c";
}

function setHomepageForm(value){
    const v={...HOMEPAGE_DEFAULTS,...(value||{})};
    const map={
        homeBadgeInput:"badge",homeHeroLeadInput:"hero_lead",homeHeroHighlightInput:"hero_highlight",
        homeHeroTailInput:"hero_tail",homeHeroDescriptionInput:"hero_description",homeSearchPlaceholderInput:"search_placeholder",
        homeCategoryTitleInput:"category_title",homeCategorySubtitleInput:"category_subtitle",
        homeEmergencyTitleInput:"emergency_title",homeEmergencySubtitleInput:"emergency_subtitle",
        homeAnnouncementTitleInput:"announcement_title",homeAnnouncementSubtitleInput:"announcement_subtitle",
        homeSubmitTitleInput:"submit_title",homeSubmitSubtitleInput:"submit_subtitle",
        homeSubmitBodyInput:"submit_body",homeSubmitButtonInput:"submit_button"
    };
    Object.entries(map).forEach(([id,key])=>{const el=document.getElementById(id); if(el) el.value=v[key] ?? "";});
}

function resetHomepageFormToDefaults(){
    setHomepageForm(HOMEPAGE_DEFAULTS);
    homepageStatus("Default text loaded — Save করলে Public Website-এ যাবে");
}

async function loadHomepageContent(){
    if(!document.getElementById("homepageCmsManagement")) return;
    homepageStatus("Loading...");
    const {data,error}=await window.supabaseClient
        .from("site_settings")
        .select("key,value")
        .eq("key","homepage_content")
        .maybeSingle();
    if(error){
        console.error("Homepage CMS load error:",error);
        setHomepageForm(HOMEPAGE_DEFAULTS);
        homepageStatus("Database value load হয়নি; default দেখানো হচ্ছে",true);
        return;
    }
    homepageSettingsRecord=data || null;
    setHomepageForm(data && data.value ? data.value : HOMEPAGE_DEFAULTS);
    homepageStatus(data ? "Current homepage content loaded" : "Default content loaded — এখনও save করা হয়নি");
}

function homepagePayloadFromForm(){
    const get=id=>String(document.getElementById(id)?.value || "").trim();
    return {
        badge:get("homeBadgeInput"),hero_lead:get("homeHeroLeadInput"),hero_highlight:get("homeHeroHighlightInput"),
        hero_tail:get("homeHeroTailInput"),hero_description:get("homeHeroDescriptionInput"),search_placeholder:get("homeSearchPlaceholderInput"),
        category_title:get("homeCategoryTitleInput"),category_subtitle:get("homeCategorySubtitleInput"),
        emergency_title:get("homeEmergencyTitleInput"),emergency_subtitle:get("homeEmergencySubtitleInput"),
        announcement_title:get("homeAnnouncementTitleInput"),announcement_subtitle:get("homeAnnouncementSubtitleInput"),
        submit_title:get("homeSubmitTitleInput"),submit_subtitle:get("homeSubmitSubtitleInput"),
        submit_body:get("homeSubmitBodyInput"),submit_button:get("homeSubmitButtonInput")
    };
}

async function saveHomepageContent(){
    const value=homepagePayloadFromForm();
    if(!value.hero_lead || !value.hero_highlight || !value.hero_tail){
        alert("Hero Lead, Highlight এবং Second Line লিখুন"); return;
    }
    homepageStatus("Saving...");
    try{
        let result;
        if(homepageSettingsRecord){
            result=await window.supabaseClient.from("site_settings")
                .update({value,updated_at:new Date().toISOString()})
                .eq("key","homepage_content").select("key,value").single();
        }else{
            result=await window.supabaseClient.from("site_settings")
                .insert({key:"homepage_content",value})
                .select("key,value").single();
        }
        if(result.error) throw result.error;
        homepageSettingsRecord=result.data;
        homepageStatus("Saved successfully ✓");
        alert("Homepage content save হয়েছে");
    }catch(error){
        console.error("Homepage save error:",error);
        homepageStatus("Save হয়নি: "+error.message,true);
        alert("Homepage save করা যায়নি: "+error.message);
    }
}

// ===============================
// PHASE 2 PART 3 - ANNOUNCEMENTS
// ===============================

function announcementEscape(v){
    return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

async function loadAnnouncementsAdmin(){
    const box=document.getElementById("announcementAdminList");
    if(!box) return;
    box.textContent="Loading...";
    const {data,error}=await window.supabaseClient.from("announcements")
        .select("*")
        .order("sort_order",{ascending:true})
        .order("created_at",{ascending:false});
    if(error){box.textContent="Load হয়নি: "+error.message; return;}
    adminAnnouncements=data || [];
    renderAnnouncementsAdmin();
}

function renderAnnouncementsAdmin(){
    const box=document.getElementById("announcementAdminList"); if(!box) return;
    if(!adminAnnouncements.length){box.innerHTML='<div class="cms-note">এখনও কোনো Announcement নেই।</div>';return;}
    box.innerHTML=adminAnnouncements.map(a=>`<div class="announcement-row ${a.active?'':'inactive'}">
        <div class="announcement-row-head"><div><h4>${announcementEscape(a.title||"")}</h4><div class="announcement-meta">${announcementEscape(a.date_label||"No date")} • Order ${Number(a.sort_order??100)} • ${a.active?'Active':'Hidden'}</div></div></div>
        ${a.body?`<div class="announcement-body">${announcementEscape(a.body)}</div>`:''}
        ${a.link_url?`<div class="announcement-meta">Link: ${announcementEscape(a.link_url)}</div>`:''}
        <div class="announcement-actions">
          <button class="edit" onclick="openAnnouncementEdit(${Number(a.id)})">Edit</button>
          <button class="btn-warning" onclick="toggleAnnouncementActive(${Number(a.id)},${a.active?'false':'true'})">${a.active?'Hide':'Show'}</button>
          <button class="delete" onclick="deleteAnnouncement(${Number(a.id)})">Delete</button>
        </div></div>`).join("");
}

function announcementFormPayload(prefix="announcement"){
    const get=id=>String(document.getElementById(id)?.value || "").trim();
    const active=document.getElementById(prefix+"Active")?.checked ?? true;
    return {
        date_label:get(prefix+"Date"),title:get(prefix+"Title"),body:get(prefix+"Body"),
        link_url:get(prefix+"Link"),sort_order:Number(get(prefix+"Sort") || 100),active
    };
}

async function addAnnouncement(){
    const payload=announcementFormPayload("announcement");
    if(!payload.title){alert("Announcement title লিখুন");return;}
    const {error}=await window.supabaseClient.from("announcements").insert(payload);
    if(error){alert("Add হয়নি: "+error.message);return;}
    ["announcementDate","announcementTitle","announcementBody","announcementLink"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
    document.getElementById("announcementSort").value="100";
    document.getElementById("announcementActive").checked=true;
    await loadAnnouncementsAdmin(); await loadStats();
    alert("Announcement add হয়েছে");
}

function openAnnouncementEdit(id){
    const a=adminAnnouncements.find(x=>Number(x.id)===Number(id)); if(!a) return;
    document.getElementById("announcementEditId").value=a.id;
    document.getElementById("announcementEditDate").value=a.date_label||"";
    document.getElementById("announcementEditTitle").value=a.title||"";
    document.getElementById("announcementEditBody").value=a.body||"";
    document.getElementById("announcementEditLink").value=a.link_url||"";
    document.getElementById("announcementEditSort").value=Number(a.sort_order??100);
    document.getElementById("announcementEditActive").checked=!!a.active;
    document.getElementById("announcementEditModal").style.display="flex";
}

function closeAnnouncementEdit(){
    const m=document.getElementById("announcementEditModal"); if(m)m.style.display="none";
}

async function saveAnnouncementEdit(){
    const id=Number(document.getElementById("announcementEditId").value);
    const payload=announcementFormPayload("announcementEdit");
    if(!payload.title){alert("Announcement title লিখুন");return;}
    const {error}=await window.supabaseClient.from("announcements")
        .update({...payload,updated_at:new Date().toISOString()}).eq("id",id);
    if(error){alert("Update হয়নি: "+error.message);return;}
    closeAnnouncementEdit(); await loadAnnouncementsAdmin();
    alert("Announcement update হয়েছে");
}

async function toggleAnnouncementActive(id,active){
    const {error}=await window.supabaseClient.from("announcements")
        .update({active:!!active,updated_at:new Date().toISOString()}).eq("id",id);
    if(error){alert("Status change হয়নি: "+error.message);return;}
    await loadAnnouncementsAdmin();
}

async function deleteAnnouncement(id){
    const a=adminAnnouncements.find(x=>Number(x.id)===Number(id));
    if(!confirm(`Delete করবেন?\n${a?.title||"Announcement"}`)) return;
    const {error}=await window.supabaseClient.from("announcements").delete().eq("id",id);
    if(error){alert("Delete হয়নি: "+error.message);return;}
    await loadAnnouncementsAdmin(); await loadStats();
}



// ===============================
// PHASE 2 PART 4 - ADS MANAGEMENT
// ===============================

function adsEscape(v){
    return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function setAdsStatus(text,isError=false){
    const el=document.getElementById("adsStatus");
    if(!el) return;
    el.textContent=text||"";
    el.style.color=isError ? "#b42318" : "#5d247c";
}

function previewAdminAdImage(event,previewId){
    const file=event.target.files && event.target.files[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){alert("শুধু image file দিন");event.target.value="";return;}
    if(file.size>5*1024*1024){alert("Image 5 MB-এর মধ্যে রাখুন");event.target.value="";return;}
    const img=document.getElementById(previewId);
    if(img){img.src=URL.createObjectURL(file);img.style.display="block";}
}

function normalizeAdLink(v){
    const x=String(v||"").trim();
    if(!x) return "";
    if(/^https?:\/\//i.test(x)) return x;
    return "https://"+x.replace(/^\/+/,"");
}

async function uploadAdImage(file){
    if(!file) return "";
    const ext=(file.name.split(".").pop()||"jpg").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()||"jpg";
    const path=`ad_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;
    const {error}=await window.supabaseClient.storage.from("image").upload(path,file,{cacheControl:"3600",upsert:false});
    if(error) throw error;
    const {data}=window.supabaseClient.storage.from("image").getPublicUrl(path);
    return data?.publicUrl||"";
}

async function loadAdsAdmin(){
    const box=document.getElementById("adsAdminList");
    if(!box) return;
    box.textContent="Loading...";
    const {data,error}=await window.supabaseClient.from("ads").select("*").order("created_at",{ascending:false}).order("id",{ascending:false});
    if(error){box.textContent="Load হয়নি: "+error.message;setAdsStatus("Ads load হয়নি",true);return;}
    adminAds=data||[];
    renderAdsAdmin();
    setAdsStatus(adminAds.length?`${adminAds.length} ad loaded`:"এখনও কোনো ad নেই");
}

function renderAdsAdmin(){
    const box=document.getElementById("adsAdminList");if(!box)return;
    if(!adminAds.length){box.innerHTML='<div class="cms-note">এখনও কোনো Advertisement নেই।</div>';return;}
    box.innerHTML=adminAds.map(a=>`<div class="adm-ad-row ${a.status?'':'inactive'}">
      <img class="adm-ad-thumb" src="${adsEscape(a.image_url||'')}" alt="${adsEscape(a.title||'Ad')}" onerror="this.style.visibility='hidden'">
      <div class="adm-ad-info">
        <h4>${adsEscape(a.title||'Untitled Ad')}</h4>
        <div class="adm-ad-meta">Position: <b>${adsEscape(a.position||'')}</b> • ${a.status?'Active':'Inactive'}</div>
        <div class="adm-ad-meta">24h: <b>${Number(a.views_per_24h||1)} বার</b> • Duration: <b>${Number(a.duration_seconds||8)}s</b></div>
        ${a.link?`<div class="adm-ad-meta">Link: ${adsEscape(a.link)}</div>`:''}
        <div class="adm-ad-actions">
          <button class="edit" onclick="openAdEdit(${Number(a.id)})">Edit</button>
          <button class="btn-warning" onclick="toggleAdStatus(${Number(a.id)},${a.status?'false':'true'})">${a.status?'Deactivate':'Activate'}</button>
          <button class="delete" onclick="deleteAd(${Number(a.id)})">Delete</button>
        </div>
      </div>
    </div>`).join("");
}

async function deactivateOtherAds(position,exceptId=null){
    let q=window.supabaseClient.from("ads").update({status:false}).eq("position",position).eq("status",true);
    if(exceptId!=null) q=q.neq("id",Number(exceptId));
    const {error}=await q;
    if(error) throw error;
}

function clampAdInt(value,min,max,fallback){
    const n=Math.round(Number(value));
    if(!Number.isFinite(n)) return fallback;
    return Math.max(min,Math.min(max,n));
}

async function addAd(){
    const title=String(document.getElementById("adTitle")?.value||"").trim();
    const position=String(document.getElementById("adPosition")?.value||"popup");
    const link=normalizeAdLink(document.getElementById("adLink")?.value||"");
    const views_per_24h=clampAdInt(document.getElementById("adViews24h")?.value,1,100,1);
    const duration_seconds=clampAdInt(document.getElementById("adDuration")?.value,3,300,8);
    const status=!!document.getElementById("adStatus")?.checked;
    const input=document.getElementById("adImageFile");
    const file=input?.files?.[0]||null;
    if(!title){alert("Ad Title লিখুন");return;}
    if(!file){alert("Ad Image নির্বাচন করুন");return;}
    setAdsStatus("Uploading...");
    try{
        const image_url=await uploadAdImage(file);
        if(status) await deactivateOtherAds(position);
        const {error}=await window.supabaseClient.from("ads").insert({title,image_url,link,position,status,views_per_24h,duration_seconds});
        if(error) throw error;
        document.getElementById("adTitle").value="";document.getElementById("adLink").value="";document.getElementById("adPosition").value="popup";document.getElementById("adViews24h").value="1";document.getElementById("adDuration").value="8";document.getElementById("adStatus").checked=true;
        if(input)input.value="";const prev=document.getElementById("adImagePreview");if(prev){prev.removeAttribute("src");prev.style.display="none";}
        await loadAdsAdmin();await loadStats();
        alert("Ad add হয়েছে");
    }catch(error){console.error("Ad add error",error);setAdsStatus("Add হয়নি: "+error.message,true);alert("Ad add করা যায়নি: "+error.message);}
}

function openAdEdit(id){
    const a=adminAds.find(x=>Number(x.id)===Number(id));if(!a)return;
    document.getElementById("adEditId").value=a.id;
    document.getElementById("adEditTitle").value=a.title||"";
    document.getElementById("adEditPosition").value=a.position||"popup";
    document.getElementById("adEditLink").value=a.link||"";
    document.getElementById("adEditViews24h").value=Number(a.views_per_24h||1);
    document.getElementById("adEditDuration").value=Number(a.duration_seconds||8);
    document.getElementById("adEditStatus").checked=!!a.status;
    const input=document.getElementById("adEditImageFile");if(input)input.value="";
    const img=document.getElementById("adEditImagePreview");if(img){img.src=a.image_url||"";img.style.display=a.image_url?"block":"none";}
    document.getElementById("adEditModal").style.display="flex";
}

function closeAdEdit(){const m=document.getElementById("adEditModal");if(m)m.style.display="none";}

async function saveAdEdit(){
    const id=Number(document.getElementById("adEditId")?.value);
    const a=adminAds.find(x=>Number(x.id)===id);if(!a)return;
    const title=String(document.getElementById("adEditTitle")?.value||"").trim();
    const position=String(document.getElementById("adEditPosition")?.value||"popup");
    const link=normalizeAdLink(document.getElementById("adEditLink")?.value||"");
    const views_per_24h=clampAdInt(document.getElementById("adEditViews24h")?.value,1,100,1);
    const duration_seconds=clampAdInt(document.getElementById("adEditDuration")?.value,3,300,8);
    const status=!!document.getElementById("adEditStatus")?.checked;
    const file=document.getElementById("adEditImageFile")?.files?.[0]||null;
    if(!title){alert("Ad Title লিখুন");return;}
    try{
        let image_url=a.image_url||"";
        if(file) image_url=await uploadAdImage(file);
        if(!image_url){alert("Ad Image দরকার");return;}
        if(status) await deactivateOtherAds(position,id);
        const {error}=await window.supabaseClient.from("ads").update({title,image_url,link,position,status,views_per_24h,duration_seconds}).eq("id",id);
        if(error) throw error;
        closeAdEdit();await loadAdsAdmin();await loadStats();alert("Ad update হয়েছে");
    }catch(error){console.error(error);alert("Ad update হয়নি: "+error.message);}
}

async function toggleAdStatus(id,status){
    const a=adminAds.find(x=>Number(x.id)===Number(id));if(!a)return;
    try{
        if(status) await deactivateOtherAds(a.position,id);
        const {error}=await window.supabaseClient.from("ads").update({status:!!status}).eq("id",Number(id));
        if(error) throw error;
        await loadAdsAdmin();await loadStats();
    }catch(error){alert("Status change হয়নি: "+error.message);}
}

async function deleteAd(id){
    const a=adminAds.find(x=>Number(x.id)===Number(id));
    if(!confirm(`Delete করবেন?\n${a?.title||'Advertisement'}`))return;
    const {error}=await window.supabaseClient.from("ads").delete().eq("id",Number(id));
    if(error){alert("Delete হয়নি: "+error.message);return;}
    await loadAdsAdmin();await loadStats();
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

