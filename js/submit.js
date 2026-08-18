// Voice of Goila - Submit System


document
.getElementById("submitForm")
.addEventListener("submit", async function(e){


e.preventDefault();



const submission = {


name:
document.getElementById("name").value,


cat:
document.getElementById("cat").value,


subcat:
document.getElementById("subcat").value,


phone:
document.getElementById("phone").value,


map_url:
document.getElementById("map_url").value,


address:
document.getElementById("address").value,


description:
document.getElementById("description").value,


status:
"pending"


};



const {error} =
await window.supabaseClient
.from("submissions")
.insert(submission);



if(error){

console.log(error);

alert("তথ্য জমা দিতে সমস্যা হয়েছে");

return;

}



alert(
"আপনার তথ্য সফলভাবে জমা হয়েছে। Admin যাচাই করার পর প্রকাশ করা হবে।"
);



document
.getElementById("submitForm")
.reset();


});
