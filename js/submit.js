// Voice of Goila Submission


document
.getElementById("submitForm")
.addEventListener("submit", async function(e){


e.preventDefault();



const data = {


cat:
document.getElementById("cat").value,


subcat:
document.getElementById("subcat").value,


name:
document.getElementById("name").value,


phone:
document.getElementById("phone").value,


map_url:
document.getElementById("map_url").value,


address:
document.getElementById("address").value,


description:
document.getElementById("description").value,


status:"pending"


};



const {error}=await window.supabaseClient
.from("submissions")
.insert(data);



if(error){

alert("তথ্য জমা হয়নি");

console.log(error);

return;

}



alert("তথ্য সফলভাবে জমা হয়েছে। Admin approval এর পর প্রকাশ হবে।");


document
.getElementById("submitForm")
.reset();


});
