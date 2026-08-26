// Voice of Goila Admin
// Final Stable Version


let directoryData = [];

let selectedImageFile = null;

// Directory edit image state (Final Audit)
let editOriginalImageUrl = "";
let editRemoveImageRequested = false;
let editPreviewObjectUrl = "";

let managedCategories = [];
let managedSubCategories = [];
let websiteSettingsRecord = null;
let adminAnnouncements = [];
let adminNotices = [];
let homepageSettingsRecord = null;
let adminAds = [];
let adminEmergencyNumbers = [];
let adminReviews = [];





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

function showNotices(){
    const section=document.getElementById("noticesManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
    loadNoticesAdmin();
}

function showAds(){
    const section=document.getElementById("adsManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
}

function showEmergencyCMS(){
    const section=document.getElementById("emergencyManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
}

function showReviewsCMS(){
    const section=document.getElementById("reviewsManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
}

function showAnalytics(){
    const section=document.getElementById("analyticsManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
    loadAnalytics();
}

function showMediaLibrary(){
    const section=document.getElementById("mediaLibraryManagement");
    if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
    loadMediaLibrary();
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
loadNoticesAdmin();
loadAdsAdmin();
loadEmergencyAdmin();
loadReviewsAdmin();
loadAnalytics();
loadMediaLibrary();


}









// ===============================
// DASHBOARD STATS
// ===============================


async function loadStats(){

const [total,pending,approved,categoriesCount,subCategoriesCount,announcementCount,noticeCount,adsCount,emergencyCount,reviewPendingCount] = await Promise.all([
    window.supabaseClient.from("directory_items").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("submissions").select("*",{count:"exact",head:true}).eq("status","pending"),
    window.supabaseClient.from("submissions").select("*",{count:"exact",head:true}).eq("status","approved"),
    window.supabaseClient.from("categories").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("sub_categories").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("announcements").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("notices").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("ads").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("emergency_numbers").select("*",{count:"exact",head:true}),
    window.supabaseClient.from("reviews").select("*",{count:"exact",head:true}).eq("status","pending")
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
setCount("noticeCount",noticeCount);
setCount("adsCount",adsCount);
setCount("emergencyCount",emergencyCount);
setCount("reviewPendingCount",reviewPendingCount);

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


function setDirectoryEditImageButton(){
    const btn=document.getElementById("removeEditImageBtn");
    if(!btn) return;
    const input=document.getElementById("editImage");
    const hasSelected=!!(input?.files && input.files[0]);
    const hasImage=!!editOriginalImageUrl || hasSelected || editRemoveImageRequested;
    btn.style.display=hasImage?"inline-block":"none";
    btn.textContent=editRemoveImageRequested?"↩ Cancel Remove":"🗑️ Remove Image";
}

function clearEditPreviewObjectUrl(){
    if(editPreviewObjectUrl){
        try{URL.revokeObjectURL(editPreviewObjectUrl);}catch(e){}
        editPreviewObjectUrl="";
    }
}

function showEditImage(event){
    const file=event.target.files[0];
    const name=document.getElementById("editImageName");
    const preview=document.getElementById("editImagePreview");
    if(!file) return;

    editRemoveImageRequested=false;
    clearEditPreviewObjectUrl();
    editPreviewObjectUrl=URL.createObjectURL(file);
    if(name) name.textContent="Selected Image: "+file.name;
    if(preview){
        preview.src=editPreviewObjectUrl;
        preview.style.display="block";
    }
    setDirectoryEditImageButton();
}

function removeDirectoryEditImage(){
    const input=document.getElementById("editImage");
    const name=document.getElementById("editImageName");
    const preview=document.getElementById("editImagePreview");

    if(editRemoveImageRequested){
        editRemoveImageRequested=false;
        if(input) input.value="";
        clearEditPreviewObjectUrl();
        if(editOriginalImageUrl){
            if(preview){preview.src=editOriginalImageUrl;preview.style.display="block";}
            if(name) name.textContent="No new image selected";
        }else{
            if(preview){preview.removeAttribute("src");preview.style.display="none";}
            if(name) name.textContent="No image selected";
        }
        setDirectoryEditImageButton();
        return;
    }

    if(!editOriginalImageUrl && !(input?.files && input.files[0])) return;
    editRemoveImageRequested=true;
    if(input) input.value="";
    clearEditPreviewObjectUrl();
    if(preview){preview.removeAttribute("src");preview.style.display="none";}
    if(name) name.textContent="Image will be removed after Save Changes";
    setDirectoryEditImageButton();
}


// ===============================
// BLOOD DONOR NOTIFICATIONS
// ===============================

function isBloodDonorCategory(value){
    const v=String(value||"").trim().toLowerCase();
    return v==="blood" || v.includes("ব্লাড") || v.includes("রক্ত");
}

function bloodGroupLabel(value){
    const v=String(value||"").trim().toUpperCase().replace(/\s+/g,"");
    const allowed=["A+","A-","B+","B-","O+","O-","AB+","AB-"];
    return allowed.includes(v) ? v : "";
}

function shouldOfferBloodNotification(cat,subcat){
    return isBloodDonorCategory(cat) && !!bloodGroupLabel(subcat);
}

function bloodDonorNotificationPayload(subcat,itemId){
    const group=bloodGroupLabel(subcat);
    if(!group) return null;
    return {
        title:`নতুন ${group} রক্তদাতা যুক্ত হয়েছে`,
        body:`${group} গ্রুপের একজন নতুন রক্তদাতা তালিকাভুক্ত হয়েছেন। বিস্তারিত দেখুন।`,
        type:"blood_donor",
        url:itemId ? `https://voiceofgoila.pages.dev/?item=${encodeURIComponent(itemId)}` : "https://voiceofgoila.pages.dev"
    };
}

async function sendAdminNotification(payload){
    if(!payload) return {ok:false,skipped:true,message:"Notification payload unavailable"};
    try{
        const {data,error}=await window.supabaseClient.functions.invoke("send-notification",{
            body:payload
        });
        if(error) throw error;
        if(!data || data.success!==true){
            throw new Error(data?.error || data?.message || "Notification send failed");
        }
        return {ok:true,data};
    }catch(error){
        console.error("Notification send error:",error);
        return {ok:false,error,message:error?.message || String(error)};
    }
}

function pendingNotificationChecked(id){
    const el=document.getElementById(`notifySubmission-${id}`);
    return !!(el && el.checked);
}

function updateDirectoryNotificationOption(){
    const cat=document.getElementById("addDirCat")?.value||"";
    const subcat=document.getElementById("addDirSubcat")?.value||"";
    const wrap=document.getElementById("addDirNotifyWrap");
    const checkbox=document.getElementById("addDirNotify");
    const show=shouldOfferBloodNotification(cat,subcat);

    if(wrap) wrap.style.display=show ? "block" : "none";

    if(checkbox){
        checkbox.disabled=!show;

        if(show && checkbox.dataset.userChanged!=="1"){
            checkbox.checked=true;
        }

        if(!show){
            checkbox.checked=false;
            delete checkbox.dataset.userChanged;
        }
    }
}

document.addEventListener("change",function(event){
    if(event.target?.id==="addDirNotify"){
        event.target.dataset.userChanged="1";
    }
});

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

const pendingCard = document.getElementById("pendingSubmissionCard");

if(!box)
return;

if(!data || data.length===0){
box.innerHTML="";
if(pendingCard) pendingCard.style.display="none";
selectedImageFile=null;
const submissionImage=document.getElementById("submissionImage");
if(submissionImage) submissionImage.value="";
const imagePreview=document.getElementById("imagePreview");
if(imagePreview) imagePreview.style.display="none";
return;
}

if(pendingCard) pendingCard.style.display="block";

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

${shouldOfferBloodNotification(item.cat,item.subcat) ? `
<div class="cms-note" style="margin:12px 0 4px;border-left-color:#7e19b4;">
<label style="display:flex;align-items:center;gap:8px;font-weight:800;color:#4e1f6d;">
<input id="notifySubmission-${item.id}" type="checkbox" checked style="width:auto;margin:0;">
🔔 Approve করার সাথে Notification পাঠাবেন
</label>
<div style="margin-top:5px;font-size:12px;color:#75677d;">${bloodGroupLabel(item.subcat)} group-এর নতুন donor notification যাবে।</div>
</div>` : ""}


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
        alert("Submission load করা যায়নি: "+error.message);
        return;
    }

    const sendNotification=
        shouldOfferBloodNotification(item.cat,item.subcat) &&
        pendingNotificationChecked(id);

    let imageUrl="";

    if(selectedImageFile){
        imageUrl=await uploadImage(selectedImageFile)||"";
        if(!imageUrl) return;
    }

    const {data:inserted,error:insertError}=
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
    })
    .select("id")
    .single();

    if(insertError){
        if(imageUrl) await deleteDirectoryStorageImageByUrl(imageUrl);
        alert(insertError.message);
        console.log(insertError);
        return;
    }

    const {error:approveError}=
    await window.supabaseClient
    .from("submissions")
    .update({
        status:"approved",
        reviewed_at:new Date().toISOString()
    })
    .eq("id",id);

    if(approveError){
        console.error("Submission status update error:",approveError);
        alert("Directory-তে তথ্য যোগ হয়েছে, কিন্তু Submission status update হয়নি: "+approveError.message);
        return;
    }

    let notificationResult=null;

    if(sendNotification){
        notificationResult=await sendAdminNotification(
            bloodDonorNotificationPayload(item.subcat,inserted?.id)
        );
    }

    selectedImageFile=null;

    const submissionImage=document.getElementById("submissionImage");
    if(submissionImage) submissionImage.value="";

    const imagePreview=document.getElementById("imagePreview");
    if(imagePreview) imagePreview.style.display="none";

    await loadAll();

    if(sendNotification){
        if(notificationResult?.ok){
            alert(`Approved Successfully\n🔔 ${bloodGroupLabel(item.subcat)} donor notification পাঠানো হয়েছে।`);
        }else{
            alert("Approved Successfully\n⚠️ Donor publish হয়েছে, কিন্তু notification পাঠানো যায়নি। Edge Function logs দেখুন।");
        }
    }else{
        alert("Approved Successfully");
    }
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










function adminCategoryLabel(value){
    const v=String(value||"");
    const map={
        government:"সরকারি ও ইউনিয়ন সেবা",
        education:"শিক্ষা প্রতিষ্ঠান",
        coaching:"কোচিং / হোম টিউটর",
        health:"স্বাস্থ্যসেবা",
        business:"ব্যবসা ও দোকান",
        banking:"ব্যাংক",
        religion:"ধর্মীয় প্রতিষ্ঠান",
        blood:"ব্লাড ডোনার্স",
        police:"পুলিশ",
        fire:"ফায়ার সার্ভিস",
        ambulance:"অ্যাম্বুলেন্স",
        doctor:"ডাক্তার",
        electricity:"বিদ্যুৎ",
        places:"গুরুত্বপূর্ণ স্থান",
        people:"গুরুত্বপূর্ণ ব্যক্তিবর্গ",
        post:"ডাকঘর",
        transport:"যাতায়াত ও যোগাযোগ",
        social:"সামাজিক সংগঠন",
        coaching:"কোচিং / হোম টিউটর"
    };
    return map[v]||v;
}
function adminSubcategoryLabel(value){
    const v=String(value||"");
    const map={
        "coaching-center":"কোচিং সেন্টার",
        "home-tutor":"হোম টিউটর",
        "subject-tutor":"বিষয়ভিত্তিক শিক্ষক",
        "admission":"ভর্তি / এডমিশন কোচিং",
        "university-student":"দেশ-বিদেশে বিশ্ববিদ্যালয়ের শিক্ষার্থী",
        "abroad-student":"দেশ-বিদেশে বিশ্ববিদ্যালয়ের শিক্ষার্থী",
        "public-university":"দেশ-বিদেশে বিশ্ববিদ্যালয়ের শিক্ষার্থী",
        "innovator":"উদ্ভাবক",
        "pharmacy":"ফার্মেসি"
    };
    return map[v]||v;
}

const ADMIN_DIRECTORY_CATEGORIES=[
    ["government","সরকারি ও ইউনিয়ন সেবা"],
    ["education","শিক্ষা প্রতিষ্ঠান"],
    ["coaching","কোচিং / হোম টিউটর"],
    ["health","স্বাস্থ্যসেবা"],
    ["business","ব্যবসা ও দোকান"],
    ["banking","ব্যাংক"],
    ["religion","ধর্মীয় প্রতিষ্ঠান"],
    ["blood","ব্লাড ডোনার্স"],
    ["police","পুলিশ"],
    ["fire","ফায়ার সার্ভিস"],
    ["ambulance","অ্যাম্বুলেন্স"],
    ["doctor","ডাক্তার"],
    ["electricity","বিদ্যুৎ"],
    ["places","গুরুত্বপূর্ণ স্থান"],
    ["people","গুরুত্বপূর্ণ ব্যক্তিবর্গ"],
    ["post","ডাকঘর"],
    ["transport","যাতায়াত ও যোগাযোগ"],
    ["social","সামাজিক সংগঠন"]
];

const ADMIN_DIRECTORY_SUBCATEGORIES={
    government:[["union","ইউনিয়ন পরিষদ"],["upazila","উপজেলা সরকারি কর্মকর্তা"],["govt-office","অন্যান্য সরকারি অফিস"],["public-service","সরকারি সেবা"]],
    education:[["primary","প্রাথমিক বিদ্যালয়"],["secondary","মাধ্যমিক বিদ্যালয়"],["college","কলেজ"],["madrasa","মাদ্রাসা"],["teachers","শিক্ষক ও কর্মচারী"],["other","অন্যান্য শিক্ষা প্রতিষ্ঠান"]],
    coaching:[["coaching-center","কোচিং সেন্টার"],["home-tutor","হোম টিউটর"],["subject-tutor","বিষয়ভিত্তিক শিক্ষক"],["admission","ভর্তি / এডমিশন কোচিং"],["other","অন্যান্য"]],
    health:[["hospital","হাসপাতাল/ক্লিনিক"],["doctor","ডাক্তার"],["diagnostic","ডায়াগনস্টিক/ল্যাব"],["ambulance","অ্যাম্বুলেন্স"]],
    business:[["grocery","মুদি দোকান"],["restaurant","হোটেল/রেস্টুরেন্ট"],["pharmacy","ফার্মেসি"],["sweets","মিষ্টান্ন ভান্ডার/বেকারি"],["library","লাইব্রেরি/স্টেশনারি"],["mfs","বিকাশ/নগদ/রকেট এজেন্ট"],["fashion","কাপড় ও ফ্যাশন"],["tailor","টেইলার্স"],["cosmetics","কসমেটিকস"],["mobile","মোবাইল/ইলেকট্রনিক্স"],["mobile-service","মোবাইল সার্ভিসিং"],["computer","কম্পিউটার/ফটোকপি/অনলাইন সেবা"],["hardware","হার্ডওয়্যার/নির্মাণ সামগ্রী"],["raw-material","কাঁচামাল/পাইকারি"],["furniture","ফার্নিচার"],["salon","সেলুন/পার্লার"],["agri","কৃষি উপকরণ"],["service","অন্যান্য ব্যবসা/সেবা"]],
    banking:[["bank","ব্যাংক শাখা"],["atm","ATM"],["agent","ব্যাংক এজেন্ট"],["mfs","বিকাশ/নগদ/রকেট"]],
    religion:[["mosque","মসজিদ"],["madrasa","ধর্মীয় শিক্ষা"],["other","অন্যান্য ধর্মীয় প্রতিষ্ঠান"]],
    blood:[["a+","A+"],["a-","A-"],["b+","B+"],["b-","B-"],["o+","O+"],["o-","O-"],["ab+","AB+"],["ab-","AB-"]],
    people:[["entrepreneur","উদ্যোক্তা"],["notable","বিশিষ্ট ব্যক্তিবর্গ"],["university-student","দেশ-বিদেশে বিশ্ববিদ্যালয়ের শিক্ষার্থী"],["innovator","উদ্ভাবক"],["social-worker","সমাজসেবক"],["professional","অন্যান্য কৃতী/পেশাজীবী"]],
    post:[["post-office","ডাকঘর"]],
    transport:[["bus","বাস/গণপরিবহন"],["courier","ডাক/কুরিয়ার"],["garage","গ্যারেজ/মেরামত"],["other","অন্যান্য যোগাযোগ সেবা"]],
    social:[["social-org","সামাজিক সংগঠন"],["club","ক্লাব/যুব সংগঠন"],["ngo","এনজিও/স্বেচ্ছাসেবী সংগঠন"]]
};

// ===============================
// LOAD DIRECTORY
// ===============================


async function loadDirectory(){



const {data,error}=

await window.supabaseClient

.from("directory_items")

.select("*")

.order("featured",{ascending:false})
.order("sort_order",{ascending:true})
.order("id",{ascending:false});





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



<div class="item ${item.featured?"ce-featured-item":""}">

${item.featured?`<span class="ce-badge">⭐ Featured</span>`:""}

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
${adminCategoryLabel(cat.name)}
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
${adminSubcategoryLabel(sub.name)}
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
// SAFE DIRECTORY IMAGE CLEANUP
// ===============================

function directoryStoragePathFromUrl(url){
    const value=String(url||"");
    const marker="/storage/v1/object/public/image/";
    const pos=value.indexOf(marker);
    if(pos<0) return "";
    const raw=value.slice(pos+marker.length).split("?")[0];
    try{return decodeURIComponent(raw);}catch(e){return raw;}
}

async function directoryImageUsageCheck(url){
    if(!url) return {safe:true,used:false};
    const queries=[
        window.supabaseClient.from("directory_items").select("id",{count:"exact",head:true}).eq("image_url",url),
        window.supabaseClient.from("ads").select("id",{count:"exact",head:true}).eq("image_url",url),
        window.supabaseClient.from("notices").select("id",{count:"exact",head:true}).eq("image_url",url),
        window.supabaseClient.from("website_settings").select("id",{count:"exact",head:true}).eq("logo_url",url),
        window.supabaseClient.from("website_settings").select("id",{count:"exact",head:true}).eq("favicon_url",url)
    ];
    try{
        const results=await Promise.all(queries);
        // Fail closed: if usage cannot be verified, keep the storage object.
        if(results.some(r=>r.error)) return {safe:false,used:true};
        return {safe:true,used:results.some(r=>Number(r.count||0)>0)};
    }catch(e){
        return {safe:false,used:true};
    }
}

async function deleteDirectoryStorageImageByUrl(url){
    const path=directoryStoragePathFromUrl(url);
    if(!path) return false; // external/non-storage URL: only unlink from DB
    try{
        const {error}=await window.supabaseClient.storage.from("image").remove([path]);
        if(error){console.warn("Storage image cleanup skipped:",error.message);return false;}
        return true;
    }catch(e){
        console.warn("Storage image cleanup skipped",e);
        return false;
    }
}

async function deleteDirectoryStorageImageIfUnused(url){
    const path=directoryStoragePathFromUrl(url);
    if(!path) return false;
    const usage=await directoryImageUsageCheck(url);
    if(!usage.safe || usage.used) return false;
    return deleteDirectoryStorageImageByUrl(url);
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
const editSort=document.getElementById("editSortOrder");if(editSort)editSort.value=Number(item.sort_order||0);
const editFeatured=document.getElementById("editFeatured");if(editFeatured)editFeatured.checked=!!item.featured;
const editActive=document.getElementById("editActive");if(editActive)editActive.value=item.active===false?"false":"true";






const img=

document.getElementById("editImagePreview");

const editInput=document.getElementById("editImage");
if(editInput) editInput.value="";
clearEditPreviewObjectUrl();
editOriginalImageUrl=item.image_url || "";
editRemoveImageRequested=false;

if(item.image_url){


img.src=item.image_url;

img.style.display="block";


}

else{


img.removeAttribute("src");
img.style.display="none";


}






document.getElementById("editImageName").textContent=

item.image_url ? "No new image selected" : "No image selected";
setDirectoryEditImageButton();





document.getElementById("editModal")
.style.display="flex";



}









// ===============================
// CLOSE EDIT
// ===============================


function closeEditModal(){
    const modal=document.getElementById("editModal");
    if(modal) modal.style.display="none";
    const input=document.getElementById("editImage");
    if(input) input.value="";
    clearEditPreviewObjectUrl();
    editOriginalImageUrl="";
    editRemoveImageRequested=false;
    setDirectoryEditImageButton();
}









// ===============================
// UPDATE DIRECTORY
// ===============================


async function updateDirectory(){
    const id=document.getElementById("editId").value;
    const oldItem=directoryData.find(x=>x.id==id);
    const oldImageUrl=oldItem?.image_url || editOriginalImageUrl || "";

    const updateData={
        name:document.getElementById("editName").value,
        cat:document.getElementById("editCat").value,
        subcat:document.getElementById("editSubcat").value,
        phone:document.getElementById("editPhone").value,
        address:document.getElementById("editAddress").value,
        map_url:document.getElementById("editMap").value,
        description:document.getElementById("editDescription").value,
        sort_order:Number(document.getElementById("editSortOrder")?.value||0),
        featured:!!document.getElementById("editFeatured")?.checked,
        active:String(document.getElementById("editActive")?.value||"true")==="true"
    };

    const imageFile=document.getElementById("editImage").files[0];
    let uploadedNewImage="";

    if(imageFile){
        uploadedNewImage=await uploadImage(imageFile);
        if(!uploadedNewImage) return; // uploadImage already shows the error
        updateData.image_url=uploadedNewImage;
    }else if(editRemoveImageRequested){
        updateData.image_url="";
    }else{
        updateData.image_url=oldImageUrl;
    }

    const {error}=await window.supabaseClient
        .from("directory_items")
        .update(updateData)
        .eq("id",id);

    if(error){
        // If DB update failed after a new upload, remove the orphan upload.
        if(uploadedNewImage) await deleteDirectoryStorageImageByUrl(uploadedNewImage);
        alert(error.message);
        console.log(error);
        return;
    }

    // After the DB no longer references the old image, remove it from Storage only
    // when no other live record uses the same URL. External URLs are never deleted.
    if(oldImageUrl && updateData.image_url!==oldImageUrl){
        await deleteDirectoryStorageImageIfUnused(oldImageUrl);
    }

    alert("Updated Successfully");
    closeEditModal();
    loadDirectory();
}


// ===============================
// DELETE DIRECTORY
// ===============================


async function deleteDirectory(id){
    if(!confirm("Delete করতে চান?")) return;

    const oldItem=directoryData.find(x=>x.id==id);
    const oldImageUrl=oldItem?.image_url || "";

    const {error}=await window.supabaseClient
        .from("directory_items")
        .delete()
        .eq("id",id);

    if(error){
        alert(error.message);
        return;
    }

    if(oldImageUrl){
        await deleteDirectoryStorageImageIfUnused(oldImageUrl);
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

    const visibleManaged=managedCategories.filter(cat=>{
        const n=String(cat.name||"").trim().toLowerCase();
        return !["agriculture","কৃষি","কৃষি ও স্থানীয় সেবা"].includes(n);
    });
    box.innerHTML=visibleManaged.map(cat=>{
        const childCount=managedSubCategories.filter(sub=>String(sub.category_id)===String(cat.id)).length;
        return `
        <div class="cms-row">
            <div>
                <strong>${cmsEscape(adminCategoryLabel(cat.name))}</strong>
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

    const hiddenLegacySubNames=new Set([
        "কুরিয়ার/ডেলিভারি","কুরিয়ার/ডেলিভারি",
        "বিদেশে পড়াশোনা করা শিক্ষার্থী","পাবলিক বিশ্ববিদ্যালয়ের শিক্ষার্থী",
        "abroad-student","public-university"
    ]);
    const visibleSubs=managedSubCategories.filter(sub=>{
        const parent=String(categoryMap.get(String(sub.category_id))||"").trim().toLowerCase();
        const name=String(sub.name||"").trim();
        if(["agriculture","কৃষি","কৃষি ও স্থানীয় সেবা"].includes(parent))return false;
        if(hiddenLegacySubNames.has(name))return false;
        if((parent==="health"||parent==="স্বাস্থ্য"||parent==="স্বাস্থ্যসেবা") && (name==="ফার্মেসি"||name==="pharmacy"))return false;
        return true;
    });

    box.innerHTML=visibleSubs.map(sub=>`
        <div class="cms-row">
            <div>
                <strong>${cmsEscape(adminSubcategoryLabel(sub.name))}</strong>
                <span class="cms-parent">${cmsEscape(adminCategoryLabel(categoryMap.get(String(sub.category_id)) || "Unknown Category"))}</span>
            </div>
            <button class="edit" onclick="openCategoryManagerEdit('subcategory',${Number(sub.id)})">Edit</button>
            <button class="delete" onclick="deleteManagedSubcategory(${Number(sub.id)})">Delete</button>
        </div>
    `).join("");
}

function fillManagedCategorySelects(selectedId=""){
    const optionHtml=[
        '<option value="">Parent Category নির্বাচন করুন</option>',
        ...managedCategories.map(cat=>`<option value="${Number(cat.id)}">${cmsEscape(adminCategoryLabel(cat.name))}</option>`)
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
        settingWhatsapp:row.whatsapp || "",
        settingSiteUrl:row.site_url || "https://voiceofgoila.github.io/",
        settingSeoDescription:row.seo_description || "গৈলা ইউনিয়নের তথ্য, প্রয়োজনীয় সেবা ও গুরুত্বপূর্ণ স্থানীয় তথ্য।",
        settingSocialShareImageUrl:row.social_share_image_url || "",
        settingDeveloperCreditLabel:row.developer_credit_label ?? "Site Developed & Maintained by",
        settingDeveloperName:row.developer_name ?? "Shawan Sarder Solyman",
        settingDeveloperProfileLink:row.developer_profile_link || "https://www.facebook.com/ShawanSarderSolyman",
        settingDeveloperSubtitle:row.developer_subtitle ?? "Innovator at Medical Assistant Robot",
        settingFooterRightsText:row.footer_rights_text ?? "© Voice of Goila · All Rights Reserved"
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
            whatsapp:settingsValue("settingWhatsapp"),
            site_url:normalizeSettingsUrl(settingsValue("settingSiteUrl")),
            seo_description:settingsValue("settingSeoDescription"),
            social_share_image_url:normalizeSettingsUrl(settingsValue("settingSocialShareImageUrl")),
            developer_credit_label:settingsValue("settingDeveloperCreditLabel"),
            developer_name:settingsValue("settingDeveloperName"),
            developer_profile_link:normalizeSettingsUrl(settingsValue("settingDeveloperProfileLink")),
            developer_subtitle:settingsValue("settingDeveloperSubtitle"),
            footer_rights_text:settingsValue("settingFooterRightsText")
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
// PHASE 2 PART 5 - EMERGENCY NUMBERS + REVIEWS
// ===============================

function p5Escape(v){
    return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function setEmergencyStatus(text,isError=false){
    const el=document.getElementById("emergencyAdminStatus");
    if(!el)return;
    el.textContent=text||"";
    el.style.color=isError?"#b42318":"#5d247c";
}

async function loadEmergencyAdmin(){
    const box=document.getElementById("emergencyAdminList");
    if(!box)return;
    box.textContent="Loading...";
    const {data,error}=await window.supabaseClient.from("emergency_numbers").select("*").order("sort_order",{ascending:true}).order("id",{ascending:true});
    if(error){box.textContent="Load হয়নি: "+error.message;setEmergencyStatus("Emergency load হয়নি",true);return;}
    adminEmergencyNumbers=data||[];
    renderEmergencyAdmin();
    setEmergencyStatus(`${adminEmergencyNumbers.length} item loaded`);
}

function renderEmergencyAdmin(){
    const box=document.getElementById("emergencyAdminList");if(!box)return;
    if(!adminEmergencyNumbers.length){box.innerHTML='<div class="cms-note">এখনও কোনো Emergency Number নেই।</div>';return;}
    box.innerHTML=adminEmergencyNumbers.map(x=>`<div class="p5-row ${x.active?'':'inactive'}">
      <div class="p5-main">
        <h4>${p5Escape(x.icon||'☎️')} ${p5Escape(x.name||'')}</h4>
        <div class="p5-meta">${p5Escape(x.note||'')}</div>
        <div class="p5-meta">Phone: <b>${p5Escape(x.phone||'')}</b> • Sort: ${Number(x.sort_order||100)} • ${x.active?'Active':'Hidden'}</div>
      </div>
      <div class="p5-actions">
        <button class="edit" onclick="openEmergencyEdit(${Number(x.id)})">Edit</button>
        <button class="btn-warning" onclick="toggleEmergencyStatus(${Number(x.id)},${x.active?'false':'true'})">${x.active?'Hide':'Show'}</button>
        <button class="delete" onclick="deleteEmergencyNumber(${Number(x.id)})">Delete</button>
      </div>
    </div>`).join("");
}

async function addEmergencyNumber(){
    const icon=String(document.getElementById("emergencyIcon")?.value||"☎️").trim()||"☎️";
    const name=String(document.getElementById("emergencyName")?.value||"").trim();
    const note=String(document.getElementById("emergencyNote")?.value||"").trim();
    const phone=String(document.getElementById("emergencyPhone")?.value||"").trim();
    const sort_order=Number(document.getElementById("emergencySort")?.value||100)||100;
    const active=!!document.getElementById("emergencyActive")?.checked;
    if(!name){alert("Name লিখুন");return;}
    if(!phone){alert("Phone লিখুন");return;}
    const {error}=await window.supabaseClient.from("emergency_numbers").insert({icon,name,note,phone,sort_order,active});
    if(error){alert("Add হয়নি: "+error.message);return;}
    document.getElementById("emergencyIcon").value="☎️";
    document.getElementById("emergencyName").value="";
    document.getElementById("emergencyNote").value="";
    document.getElementById("emergencyPhone").value="";
    document.getElementById("emergencySort").value="100";
    document.getElementById("emergencyActive").checked=true;
    await loadEmergencyAdmin();await loadStats();
}

function openEmergencyEdit(id){
    const x=adminEmergencyNumbers.find(v=>Number(v.id)===Number(id));if(!x)return;
    document.getElementById("emergencyEditId").value=x.id;
    document.getElementById("emergencyEditIcon").value=x.icon||"☎️";
    document.getElementById("emergencyEditName").value=x.name||"";
    document.getElementById("emergencyEditNote").value=x.note||"";
    document.getElementById("emergencyEditPhone").value=x.phone||"";
    document.getElementById("emergencyEditSort").value=Number(x.sort_order||100);
    document.getElementById("emergencyEditActive").checked=!!x.active;
    document.getElementById("emergencyEditModal").style.display="flex";
}

function closeEmergencyEdit(){const m=document.getElementById("emergencyEditModal");if(m)m.style.display="none";}

async function saveEmergencyEdit(){
    const id=Number(document.getElementById("emergencyEditId")?.value);
    const icon=String(document.getElementById("emergencyEditIcon")?.value||"☎️").trim()||"☎️";
    const name=String(document.getElementById("emergencyEditName")?.value||"").trim();
    const note=String(document.getElementById("emergencyEditNote")?.value||"").trim();
    const phone=String(document.getElementById("emergencyEditPhone")?.value||"").trim();
    const sort_order=Number(document.getElementById("emergencyEditSort")?.value||100)||100;
    const active=!!document.getElementById("emergencyEditActive")?.checked;
    if(!name||!phone){alert("Name ও Phone দরকার");return;}
    const {error}=await window.supabaseClient.from("emergency_numbers").update({icon,name,note,phone,sort_order,active,updated_at:new Date().toISOString()}).eq("id",id);
    if(error){alert("Update হয়নি: "+error.message);return;}
    closeEmergencyEdit();await loadEmergencyAdmin();await loadStats();
}

async function toggleEmergencyStatus(id,active){
    const {error}=await window.supabaseClient.from("emergency_numbers").update({active:!!active,updated_at:new Date().toISOString()}).eq("id",Number(id));
    if(error){alert("Status change হয়নি: "+error.message);return;}
    await loadEmergencyAdmin();await loadStats();
}

async function deleteEmergencyNumber(id){
    const x=adminEmergencyNumbers.find(v=>Number(v.id)===Number(id));
    if(!confirm(`Delete করবেন?\n${x?.name||'Emergency Number'}`))return;
    const {error}=await window.supabaseClient.from("emergency_numbers").delete().eq("id",Number(id));
    if(error){alert("Delete হয়নি: "+error.message);return;}
    await loadEmergencyAdmin();await loadStats();
}

function setReviewsStatus(text,isError=false){
    const el=document.getElementById("reviewsAdminStatus");if(!el)return;
    el.textContent=text||"";el.style.color=isError?"#b42318":"#5d247c";
}

async function loadReviewsAdmin(){
    const box=document.getElementById("reviewsAdminList");if(!box)return;
    box.textContent="Loading...";
    const {data,error}=await window.supabaseClient.from("reviews").select("*").order("created_at",{ascending:false}).order("id",{ascending:false});
    if(error){box.textContent="Load হয়নি: "+error.message;setReviewsStatus("Reviews load হয়নি",true);return;}
    adminReviews=data||[];
    renderReviewsAdmin();
    setReviewsStatus(`${adminReviews.length} review loaded`);
}

function renderReviewsAdmin(){
    const box=document.getElementById("reviewsAdminList");if(!box)return;
    const filter=String(document.getElementById("reviewStatusFilter")?.value||"all");
    const rows=filter==="all"?adminReviews:adminReviews.filter(r=>String(r.status||"")===filter);
    if(!rows.length){box.innerHTML='<div class="cms-note">এই filter-এ কোনো Review নেই।</div>';return;}
    box.innerHTML=rows.map(r=>{
      const rating=Math.max(1,Math.min(5,Number(r.rating||0)));
      const status=String(r.status||"pending");
      const date=r.created_at?new Date(r.created_at).toLocaleString("bn-BD"):"";
      return `<div class="p5-row">
        <div class="p5-main">
          <h4>${p5Escape(r.name||'একজন ব্যবহারকারী')} <span class="p5-status">${p5Escape(status)}</span></h4>
          <div class="p5-stars">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
          ${r.review_text?`<div class="p5-review-text">${p5Escape(r.review_text)}</div>`:''}
          <div class="p5-meta">${p5Escape(date)}</div>
        </div>
        <div class="p5-actions">
          ${status!=='approved'?`<button class="edit" onclick="setReviewStatus(${Number(r.id)},'approved')">Approve</button>`:''}
          ${status!=='rejected'?`<button class="btn-warning" onclick="setReviewStatus(${Number(r.id)},'rejected')">Reject</button>`:''}
          <button class="delete" onclick="deleteReview(${Number(r.id)})">Delete</button>
        </div>
      </div>`;
    }).join("");
}

async function setReviewStatus(id,status){
    const {error}=await window.supabaseClient.from("reviews").update({status,reviewed_at:new Date().toISOString()}).eq("id",Number(id));
    if(error){alert("Review status update হয়নি: "+error.message);return;}
    await loadReviewsAdmin();await loadStats();
}

async function deleteReview(id){
    if(!confirm("Review delete করবেন?"))return;
    const {error}=await window.supabaseClient.from("reviews").delete().eq("id",Number(id));
    if(error){alert("Review delete হয়নি: "+error.message);return;}
    await loadReviewsAdmin();await loadStats();
}



// ===============================
// COMPLETE PACK - DIRECT DIRECTORY ADD
// ===============================
function adminDirectoryCategorySlug(rawValue){
    const raw=String(rawValue||"").trim();
    const key=raw.toLowerCase();
    const aliases={
        "government":"government","সরকারি ও ইউনিয়ন সেবা":"government","সরকারি সেবা":"government",
        "education":"education","শিক্ষা":"education","শিক্ষা প্রতিষ্ঠান":"education",
        "coaching":"coaching","কোচিং / হোম টিউটর":"coaching","কোচিং/হোম টিউটর":"coaching",
        "health":"health","স্বাস্থ্য":"health","স্বাস্থ্যসেবা":"health",
        "business":"business","ব্যবসা ও দোকান":"business","ব্যবসা ও বাণিজ্য":"business","ব্যবসা":"business",
        "banking":"banking","ব্যাংক":"banking",
        "religion":"religion","ধর্মীয় প্রতিষ্ঠান":"religion","ধর্মীয় প্রতিষ্ঠান":"religion",
        "blood":"blood","ব্লাড ডোনার্স":"blood","ব্লাড ডোনার":"blood",
        "police":"police","পুলিশ":"police",
        "fire":"fire","ফায়ার সার্ভিস":"fire","ফায়ার সার্ভিস":"fire",
        "ambulance":"ambulance","অ্যাম্বুলেন্স":"ambulance",
        "doctor":"doctor","ডাক্তার":"doctor",
        "electricity":"electricity","বিদ্যুৎ":"electricity",
        "places":"places","গুরুত্বপূর্ণ স্থান":"places",
        "people":"people","গুরুত্বপূর্ণ ব্যক্তিবর্গ":"people",
        "post":"post","ডাকঘর":"post",
        "transport":"transport","যাতায়াত ও যোগাযোগ":"transport",
        "social":"social","সামাজিক সংগঠন":"social"
    };
    return aliases[key]||"";
}

function adminDirectorySubcategorySlug(cat,rawValue){
    const raw=String(rawValue||"").trim();
    const key=raw.toLowerCase();
    const list=ADMIN_DIRECTORY_SUBCATEGORIES[cat]||[];
    const bySlug=list.find(s=>String(s[0]).toLowerCase()===key);
    if(bySlug)return bySlug[0];
    const byLabel=list.find(s=>String(s[1]).trim().toLowerCase()===key);
    if(byLabel)return byLabel[0];
    if(cat==="people" && ["abroad-student","public-university","বিদেশে পড়াশোনা করা শিক্ষার্থী","পাবলিক বিশ্ববিদ্যালয়ের শিক্ষার্থী"].includes(key))return "university-student";
    return "";
}

function shouldHideLegacyAdminCategory(rawValue){
    const key=String(rawValue||"").trim().toLowerCase();
    return ["agriculture","কৃষি","কৃষি ও স্থানীয় সেবা"].includes(key);
}

function shouldHideLegacyAdminSubcategory(cat,rawValue){
    const key=String(rawValue||"").trim().toLowerCase();
    if(cat==="post" && ["courier","কুরিয়ার/ডেলিভারি","কুরিয়ার/ডেলিভারি"].includes(key))return true;
    if(cat==="health" && ["pharmacy","ফার্মেসি"].includes(key))return true;
    return false;
}

async function fillDirectoryAddCategories(){
    const box=document.getElementById("addDirCat");if(!box)return;
    const options=[...ADMIN_DIRECTORY_CATEGORIES];
    const seen=new Set(options.map(c=>String(c[0]).toLowerCase()));

    // Preserve CMS-created custom categories while keeping the canonical list complete.
    (managedCategories||[]).forEach(row=>{
        const raw=String(row?.name||"").trim();
        if(!raw||shouldHideLegacyAdminCategory(raw))return;
        const canonical=adminDirectoryCategorySlug(raw);
        if(canonical)return;
        const key=raw.toLowerCase();
        if(seen.has(key))return;
        seen.add(key);
        options.push([raw,raw]);
    });

    box.innerHTML='<option value="">Select Category</option>'+ 
        options.map(c=>`<option value="${cmsEscape(c[0])}">${cmsEscape(c[1])}</option>`).join("");
    await changeAddSubCategory();
}

async function changeAddSubCategory(){
    const catValue=String(document.getElementById("addDirCat")?.value||"").trim();
    const box=document.getElementById("addDirSubcat");if(!box)return;
    const canonicalCat=ADMIN_DIRECTORY_SUBCATEGORIES[catValue]?catValue:adminDirectoryCategorySlug(catValue);
    const list=[...(ADMIN_DIRECTORY_SUBCATEGORIES[canonicalCat]||[])];
    const seen=new Set(list.flatMap(s=>[String(s[0]).toLowerCase(),String(s[1]).trim().toLowerCase()]));

    // Merge CMS-created custom subcategories without reintroducing removed legacy options.
    const matchingCategoryIds=new Set((managedCategories||[])
        .filter(row=>{
            const raw=String(row?.name||"").trim();
            if(!raw||shouldHideLegacyAdminCategory(raw))return false;
            if(canonicalCat)return adminDirectoryCategorySlug(raw)===canonicalCat;
            return raw.toLowerCase()===catValue.toLowerCase();
        })
        .map(row=>String(row.id)));

    (managedSubCategories||[]).forEach(row=>{
        if(!matchingCategoryIds.has(String(row?.category_id)))return;
        const raw=String(row?.name||"").trim();
        if(!raw||shouldHideLegacyAdminSubcategory(canonicalCat,raw))return;
        const canonicalSub=adminDirectorySubcategorySlug(canonicalCat,raw);
        if(canonicalSub)return;
        const key=raw.toLowerCase();
        if(seen.has(key))return;
        seen.add(key);
        list.push([raw,raw]);
    });

    box.innerHTML='<option value="">Select Sub Category</option>'+ 
        list.map(s=>`<option value="${cmsEscape(s[0])}">${cmsEscape(s[1])}</option>`).join("");
    updateDirectoryNotificationOption();
}

async function openDirectoryAdd(){
    ["addDirName","addDirPhone","addDirAddress","addDirMap","addDirDescription"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
    const sort=document.getElementById("addDirSort");if(sort)sort.value="0";
    const active=document.getElementById("addDirActive");if(active)active.checked=true;
    const featured=document.getElementById("addDirFeatured");if(featured)featured.checked=false;

    const notify=document.getElementById("addDirNotify");
    if(notify){
        notify.checked=true;
        notify.disabled=true;
        delete notify.dataset.userChanged;
    }

    const notifyWrap=document.getElementById("addDirNotifyWrap");
    if(notifyWrap) notifyWrap.style.display="none";

    const file=document.getElementById("addDirImage");if(file)file.value="";
    const prev=document.getElementById("addDirImagePreview");if(prev){prev.removeAttribute("src");prev.style.display="none";}

    await fillDirectoryAddCategories();
    updateDirectoryNotificationOption();

    const modal=document.getElementById("directoryAddModal");if(modal)modal.style.display="flex";
}
function closeDirectoryAdd(){const m=document.getElementById("directoryAddModal");if(m)m.style.display="none";}
function previewAddDirectoryImage(event){const file=event.target.files?.[0],img=document.getElementById("addDirImagePreview");if(file&&img){img.src=URL.createObjectURL(file);img.style.display="block";}}
async function saveNewDirectoryItem(){

    const name=String(document.getElementById("addDirName")?.value||"").trim();
    const cat=String(document.getElementById("addDirCat")?.value||"").trim();
    const subcat=String(document.getElementById("addDirSubcat")?.value||"").trim();

    if(!name||!cat){
        alert("Name এবং Category প্রয়োজন");
        return;
    }

    const wantsNotification=
        shouldOfferBloodNotification(cat,subcat) &&
        !!document.getElementById("addDirActive")?.checked &&
        !!document.getElementById("addDirNotify")?.checked;

    const file=document.getElementById("addDirImage")?.files?.[0];
    let imageUrl="";

    if(file){
        imageUrl=await uploadImage(file)||"";
        if(!imageUrl) return;
    }

    const payload={
        name,
        cat,
        subcat,
        phone:String(document.getElementById("addDirPhone")?.value||"").trim(),
        address:String(document.getElementById("addDirAddress")?.value||"").trim(),
        map_url:String(document.getElementById("addDirMap")?.value||"").trim(),
        description:String(document.getElementById("addDirDescription")?.value||"").trim(),
        image_url:imageUrl,
        active:!!document.getElementById("addDirActive")?.checked,
        featured:!!document.getElementById("addDirFeatured")?.checked,
        sort_order:Number(document.getElementById("addDirSort")?.value||0)
    };

    const {data:inserted,error}=
    await window.supabaseClient
    .from("directory_items")
    .insert(payload)
    .select("id")
    .single();

    if(error){
        if(imageUrl) await deleteDirectoryStorageImageByUrl(imageUrl);
        alert("Add হয়নি: "+error.message);
        return;
    }

    let notificationResult=null;

    if(wantsNotification){
        notificationResult=await sendAdminNotification(
            bloodDonorNotificationPayload(subcat,inserted?.id)
        );
    }

    closeDirectoryAdd();
    await loadDirectory();
    await loadStats();

    if(wantsNotification){
        if(notificationResult?.ok){
            alert(`Directory item added successfully\n🔔 ${bloodGroupLabel(subcat)} donor notification পাঠানো হয়েছে।`);
        }else{
            alert("Directory item added successfully\n⚠️ Donor publish হয়েছে, কিন্তু notification পাঠানো যায়নি।");
        }
    }else{
        alert("Directory item added successfully");
    }
}

// ===============================
// COMPLETE PACK - NOTICES CMS
// ===============================
function noticeAdminStatus(text,isError=false){const el=document.getElementById("noticesAdminStatus");if(el){el.textContent=text||"";el.style.color=isError?"#b42318":"#6b2c91";}}
function noticeEsc(v){return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function previewNoticeNewImage(e){const f=e.target.files?.[0],p=document.getElementById("noticeNewPreview");if(f&&p){p.src=URL.createObjectURL(f);p.style.display="block";}}
function previewNoticeEditImage(e){const f=e.target.files?.[0],p=document.getElementById("noticeEditPreview");if(f&&p){p.src=URL.createObjectURL(f);p.style.display="block";const r=document.getElementById("noticeEditRemoveImage");if(r)r.checked=false;}}
async function loadNoticesAdmin(){
    const box=document.getElementById("noticesAdminList");if(!box||!window.supabaseClient)return;
    box.innerHTML="Loading...";
    const {data,error}=await window.supabaseClient.from("notices").select("*").order("created_at",{ascending:false}).order("id",{ascending:false});
    if(error){box.textContent="Load হয়নি: "+error.message;noticeAdminStatus("Notices load হয়নি",true);return;}
    adminNotices=data||[];renderNoticesAdmin();noticeAdminStatus(`${adminNotices.length} notice loaded`);
}
function renderNoticesAdmin(){
    const box=document.getElementById("noticesAdminList");if(!box)return;
    if(!adminNotices.length){box.innerHTML='<div class="cms-note">এখনও কোনো Notice নেই।</div>';return;}
    box.innerHTML=adminNotices.map(n=>`<div class="ce-notice-row ${n.status?'':'inactive'}">${n.image_url?`<img src="${noticeEsc(n.image_url)}" alt="">`:''}<strong>${noticeEsc(n.title||'Untitled')}</strong><div class="ce-note">${noticeEsc(n.description||'')}</div><div class="ce-notice-actions"><button class="edit" onclick="openNoticeEdit(${Number(n.id)})">Edit</button><button class="btn-warning" onclick="toggleNoticeStatus(${Number(n.id)},${n.status?'false':'true'})">${n.status?'Hide':'Show'}</button><button class="delete" onclick="deleteNotice(${Number(n.id)})">Delete</button></div></div>`).join("");
}
async function addNotice(){
    const title=String(document.getElementById("noticeNewTitle")?.value||"").trim();if(!title){alert("Notice title লিখুন");return;}
    const file=document.getElementById("noticeNewImage")?.files?.[0];let imageUrl="";
    if(file){imageUrl=await uploadImage(file)||"";if(!imageUrl)return;}
    const payload={title,description:String(document.getElementById("noticeNewDescription")?.value||"").trim(),image_url:imageUrl,status:String(document.getElementById("noticeNewStatus")?.value||"true")==="true"};
    const {error}=await window.supabaseClient.from("notices").insert(payload);if(error){if(imageUrl)await deleteDirectoryStorageImageByUrl(imageUrl);alert("Notice add হয়নি: "+error.message);return;}
    document.getElementById("noticeNewTitle").value="";document.getElementById("noticeNewDescription").value="";document.getElementById("noticeNewImage").value="";const p=document.getElementById("noticeNewPreview");if(p){p.style.display="none";p.removeAttribute("src");}
    await loadNoticesAdmin();await loadStats();
}
function openNoticeEdit(id){
    const n=adminNotices.find(x=>Number(x.id)===Number(id));if(!n)return;
    document.getElementById("noticeEditId").value=n.id;document.getElementById("noticeEditTitle").value=n.title||"";document.getElementById("noticeEditDescription").value=n.description||"";document.getElementById("noticeEditStatus").checked=!!n.status;document.getElementById("noticeEditRemoveImage").checked=false;document.getElementById("noticeEditImage").value="";
    const p=document.getElementById("noticeEditPreview");if(n.image_url){p.src=n.image_url;p.style.display="block";}else{p.removeAttribute("src");p.style.display="none";}
    document.getElementById("noticeEditModal").style.display="flex";
}
function closeNoticeEdit(){const m=document.getElementById("noticeEditModal");if(m)m.style.display="none";}
async function saveNoticeEdit(){
    const id=Number(document.getElementById("noticeEditId")?.value||0),old=adminNotices.find(x=>Number(x.id)===id);if(!old)return;
    const title=String(document.getElementById("noticeEditTitle")?.value||"").trim();if(!title){alert("Title প্রয়োজন");return;}
    const file=document.getElementById("noticeEditImage")?.files?.[0];let imageUrl=old.image_url||"",newUpload="";
    if(file){newUpload=await uploadImage(file)||"";if(!newUpload)return;imageUrl=newUpload;}else if(document.getElementById("noticeEditRemoveImage")?.checked){imageUrl="";}
    const payload={title,description:String(document.getElementById("noticeEditDescription")?.value||"").trim(),image_url:imageUrl,status:!!document.getElementById("noticeEditStatus")?.checked};
    const {error}=await window.supabaseClient.from("notices").update(payload).eq("id",id);if(error){if(newUpload)await deleteDirectoryStorageImageByUrl(newUpload);alert("Save হয়নি: "+error.message);return;}
    if(old.image_url&&old.image_url!==imageUrl)await deleteDirectoryStorageImageIfUnused(old.image_url);
    closeNoticeEdit();await loadNoticesAdmin();await loadStats();
}
async function toggleNoticeStatus(id,status){const {error}=await window.supabaseClient.from("notices").update({status:!!status}).eq("id",Number(id));if(error){alert(error.message);return;}await loadNoticesAdmin();}
async function deleteNotice(id){const old=adminNotices.find(x=>Number(x.id)===Number(id));if(!confirm(`Notice delete করবেন?\n${old?.title||''}`))return;const {error}=await window.supabaseClient.from("notices").delete().eq("id",Number(id));if(error){alert(error.message);return;}if(old?.image_url)await deleteDirectoryStorageImageIfUnused(old.image_url);await loadNoticesAdmin();await loadStats();}


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

// ===============================
// PHASE 2 PART 6 - ANALYTICS
// ===============================

function p6Number(v){
    const n=Number(v||0);
    return Number.isFinite(n)?n:0;
}

function p6Format(v){
    try{return p6Number(v).toLocaleString("en-US");}catch(e){return String(p6Number(v));}
}

function p6Esc(v){
    return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function p6SetText(id,value){
    const el=document.getElementById(id);if(el)el.textContent=value;
}

function p6AnalyticsError(message){
    p6SetText("analyticsStatus",message||"");
}

function p6SummaryRow(data){
    if(Array.isArray(data))return data[0]||{};
    return data||{};
}

function renderAnalyticsDaily(rows){
    const box=document.getElementById("analyticsDaily");if(!box)return;
    rows=Array.isArray(rows)?rows:[];
    if(!rows.length){box.innerHTML='<div class="cms-note">এখনও tracking data নেই।</div>';return;}
    const max=Math.max(1,...rows.map(r=>p6Number(r.page_views)));
    box.innerHTML=rows.map(r=>{
        const views=p6Number(r.page_views), visitors=p6Number(r.unique_visitors);
        let label=String(r.day||"");
        try{label=new Date(label+"T00:00:00").toLocaleDateString("bn-BD",{day:"numeric",month:"short"});}catch(e){}
        const width=Math.max(2,Math.round((views/max)*100));
        return `<div class="p6-day"><div class="p6-day-label">${p6Esc(label)}</div><div class="p6-bar-track"><div class="p6-bar" style="width:${width}%"></div></div><div class="p6-day-count">${p6Format(visitors)} / ${p6Format(views)}</div></div>`;
    }).join("");
}

function renderPopularPages(rows){
    const box=document.getElementById("analyticsPopularPages");if(!box)return;
    rows=Array.isArray(rows)?rows:[];
    if(!rows.length){box.innerHTML='<div class="cms-note">এখনও page-view data নেই।</div>';return;}
    box.innerHTML=rows.map(r=>`<div class="p6-page"><div class="p6-page-name" title="${p6Esc(r.page_name||'')}">${p6Esc(r.page_name||"Unknown")}</div><div class="p6-page-views">${p6Format(r.views)} views</div></div>`).join("");
}


function renderPopularSearches(rows){const box=document.getElementById("analyticsPopularSearches");if(!box)return;rows=Array.isArray(rows)?rows:[];if(!rows.length){box.innerHTML='<div class="cms-note">এখনও search keyword data নেই।</div>';return;}box.innerHTML=rows.map(r=>`<div class="ce-analytics-row"><span title="${p6Esc(r.keyword||'')}">${p6Esc(r.keyword||'')}</span><b>${p6Format(r.searches)} searches</b></div>`).join("");}
function renderPopularItems(rows){const box=document.getElementById("analyticsPopularItems");if(!box)return;rows=Array.isArray(rows)?rows:[];if(!rows.length){box.innerHTML='<div class="cms-note">এখনও item-view data নেই।</div>';return;}box.innerHTML=rows.map(r=>`<div class="ce-analytics-row"><span title="${p6Esc(r.item_name||'')}">${p6Esc(r.item_name||('Item #'+(r.item_id||'')))}</span><b>${p6Format(r.views)} views</b></div>`).join("");}

async function loadAnalytics(){
    const section=document.getElementById("analyticsManagement");
    if(!section || !window.supabaseClient)return;
    p6AnalyticsError("Loading analytics...");
    try{
        const [summaryRes,dailyRes,pagesRes,searchRes,itemRes]=await Promise.all([
            window.supabaseClient.rpc("get_analytics_summary"),
            window.supabaseClient.rpc("get_analytics_daily",{p_days:7}),
            window.supabaseClient.rpc("get_popular_pages",{p_limit:10}),
            window.supabaseClient.rpc("get_popular_searches",{p_limit:10}),
            window.supabaseClient.rpc("get_popular_items",{p_limit:10})
        ]);
        const firstError=summaryRes.error||dailyRes.error||pagesRes.error||searchRes.error||itemRes.error;
        if(firstError)throw firstError;
        const x=p6SummaryRow(summaryRes.data);
        p6SetText("analyticsTotalVisitors",p6Format(x.total_visitors));
        p6SetText("analyticsTodayVisitors",p6Format(x.today_visitors));
        p6SetText("analyticsTotalViews",p6Format(x.total_page_views));
        p6SetText("analytics7dVisitors",p6Format(x.last7_visitors));
        p6SetText("analyticsMobile",p6Format(x.mobile_visitors));
        p6SetText("analyticsDesktop",p6Format(x.desktop_visitors));
        p6SetText("analyticsTablet",p6Format(x.tablet_visitors));
        p6SetText("analyticsOther",p6Format(x.other_visitors));
        renderAnalyticsDaily(dailyRes.data||[]);
        renderPopularPages(pagesRes.data||[]);
        renderPopularSearches(searchRes.data||[]);
        renderPopularItems(itemRes.data||[]);
        p6AnalyticsError("Updated: "+new Date().toLocaleTimeString("bn-BD",{hour:"2-digit",minute:"2-digit"}));
    }catch(error){
        console.error("Analytics load error",error);
        p6AnalyticsError("Analytics load হয়নি: "+(error?.message||error));
        renderAnalyticsDaily([]);renderPopularPages([]);renderPopularSearches([]);renderPopularItems([]);
    }
}



// ===============================
// PHASE 2 PART 7 - MEDIA LIBRARY
// ===============================

let mediaLibraryItems=[];
const MEDIA_BUCKET="image";

function mediaSetStatus(text,isError=false){
    const el=document.getElementById("mediaLibraryStatus");
    if(!el) return;
    el.textContent=text||"";
    el.style.color=isError?"#b42318":"#5d247c";
}

function mediaEscape(value){
    return String(value??"").replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
}

function mediaFormatBytes(bytes){
    const n=Number(bytes||0);
    if(!n) return "";
    if(n<1024) return n+" B";
    if(n<1024*1024) return (n/1024).toFixed(1)+" KB";
    return (n/(1024*1024)).toFixed(1)+" MB";
}

async function mediaListFolder(prefix="",depth=0){
    if(depth>5) return [];
    const collected=[];
    let offset=0;
    while(offset<1000){
        const {data,error}=await window.supabaseClient.storage.from(MEDIA_BUCKET).list(prefix,{
            limit:100,offset,sortBy:{column:"created_at",order:"desc"}
        });
        if(error) throw error;
        const rows=data||[];
        for(const item of rows){
            if(!item || !item.name || item.name===".emptyFolderPlaceholder") continue;
            const path=prefix?`${prefix}/${item.name}`:item.name;
            const looksLikeFolder=!item.id && (!item.metadata || Object.keys(item.metadata).length===0);
            if(looksLikeFolder){
                const nested=await mediaListFolder(path,depth+1);
                collected.push(...nested);
            }else{
                const {data:urlData}=window.supabaseClient.storage.from(MEDIA_BUCKET).getPublicUrl(path);
                collected.push({
                    name:item.name,
                    path,
                    url:urlData?.publicUrl||"",
                    created_at:item.created_at||item.updated_at||"",
                    size:item.metadata?.size||0,
                    mimetype:item.metadata?.mimetype||item.metadata?.contentType||""
                });
            }
        }
        if(rows.length<100) break;
        offset+=100;
    }
    return collected;
}

async function loadMediaLibrary(){
    const grid=document.getElementById("mediaLibraryGrid");
    if(!grid) return;
    grid.innerHTML='<div class="p7-empty">Loading media...</div>';
    mediaSetStatus("Loading...");
    try{
        mediaLibraryItems=await mediaListFolder("",0);
        mediaLibraryItems.sort((a,b)=>String(b.created_at||"").localeCompare(String(a.created_at||"")));
        renderMediaLibrary();
        mediaSetStatus(`${mediaLibraryItems.length} image/file loaded`);
    }catch(error){
        console.error("Media Library load error",error);
        mediaLibraryItems=[];
        grid.innerHTML='<div class="p7-empty">Media load হয়নি। Storage policy/check প্রয়োজন।</div>';
        mediaSetStatus("Media load হয়নি: "+(error?.message||error),true);
    }
}

function renderMediaLibrary(){
    const grid=document.getElementById("mediaLibraryGrid");
    if(!grid) return;
    const q=String(document.getElementById("mediaSearchInput")?.value||"").trim().toLowerCase();
    const rows=mediaLibraryItems.filter(x=>!q || x.name.toLowerCase().includes(q) || x.path.toLowerCase().includes(q));
    if(!rows.length){
        grid.innerHTML='<div class="p7-empty">কোনো image পাওয়া যায়নি।</div>';
        return;
    }
    grid.innerHTML=rows.map(x=>{
        const realIndex=mediaLibraryItems.findIndex(m=>m.path===x.path);
        return `<div class="p7-item">
      <a class="p7-thumb" href="${mediaEscape(x.url)}" target="_blank" rel="noopener"><img src="${mediaEscape(x.url)}" alt="${mediaEscape(x.name)}" loading="lazy" onerror="this.style.display='none'"></a>
      <div class="p7-body">
        <div class="p7-name" title="${mediaEscape(x.name)}">${mediaEscape(x.name)}</div>
        <div class="p7-path">${mediaEscape(x.path)}</div>
        <div class="p7-meta">${mediaEscape(mediaFormatBytes(x.size))}${x.created_at?` • ${mediaEscape(new Date(x.created_at).toLocaleDateString("bn-BD"))}`:""}</div>
        <div class="p7-actions">
          <button onclick="copyMediaUrl(${realIndex})">Copy URL</button>
          <button class="danger" onclick="deleteMediaItem(${realIndex})">Delete</button>
        </div>
      </div>
    </div>`;
    }).join("");
}

async function uploadMediaImage(event){
    const input=event.target;
    const file=input.files&&input.files[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){alert("শুধু image file দিন");input.value="";return;}
    if(file.size>5*1024*1024){alert("Image 5 MB-এর মধ্যে রাখুন");input.value="";return;}
    try{
        mediaSetStatus("Uploading...");
        const ext=(file.name.split(".").pop()||"jpg").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()||"jpg";
        const path=`media_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;
        const {error}=await window.supabaseClient.storage.from(MEDIA_BUCKET).upload(path,file,{cacheControl:"3600",upsert:false});
        if(error) throw error;
        input.value="";
        await loadMediaLibrary();
        mediaSetStatus("Image uploaded successfully");
    }catch(error){
        console.error("Media upload error",error);
        mediaSetStatus("Upload হয়নি: "+(error?.message||error),true);
        alert("Upload হয়নি: "+(error?.message||error));
    }
}

async function mediaUsageLabels(url){
    if(!url) return [];
    const checks=[
      ["Directory",window.supabaseClient.from("directory_items").select("id",{count:"exact",head:true}).eq("image_url",url)],
      ["Ads",window.supabaseClient.from("ads").select("id",{count:"exact",head:true}).eq("image_url",url)],
      ["Notice",window.supabaseClient.from("notices").select("id",{count:"exact",head:true}).eq("image_url",url)],
      ["Website Logo",window.supabaseClient.from("website_settings").select("id",{count:"exact",head:true}).eq("logo_url",url)],
      ["Website Favicon",window.supabaseClient.from("website_settings").select("id",{count:"exact",head:true}).eq("favicon_url",url)]
    ];
    const results=await Promise.all(checks.map(async ([label,promise])=>{
        try{const r=await promise;return (!r.error && Number(r.count||0)>0)?label:null;}catch(e){return null;}
    }));
    return results.filter(Boolean);
}

async function deleteMediaItem(index){
    const item=mediaLibraryItems[index];
    if(!item) return;
    try{
        mediaSetStatus("Checking image usage...");
        const used=await mediaUsageLabels(item.url);
        if(used.length){
            alert(`এই image বর্তমানে ${used.join(", ")}-এ ব্যবহার হচ্ছে। আগে ওই জায়গা থেকে image পরিবর্তন/সরান, তারপর delete করুন।`);
            mediaSetStatus("Delete blocked: image is in use",true);
            return;
        }
        if(!confirm(`Delete করবেন?\n${item.path}`)){mediaSetStatus("");return;}
        const {error}=await window.supabaseClient.storage.from(MEDIA_BUCKET).remove([item.path]);
        if(error) throw error;
        mediaLibraryItems=mediaLibraryItems.filter((_,i)=>i!==index);
        renderMediaLibrary();
        mediaSetStatus("Image deleted");
    }catch(error){
        console.error("Media delete error",error);
        mediaSetStatus("Delete হয়নি: "+(error?.message||error),true);
        alert("Delete হয়নি: "+(error?.message||error));
    }
}

async function copyMediaUrl(index){
    const item=mediaLibraryItems[index];
    if(!item?.url) return;
    try{
        await navigator.clipboard.writeText(item.url);
        mediaSetStatus("Image URL copied");
    }catch(e){
        window.prompt("এই URL copy করুন:",item.url);
    }
}
