// Voice of Goila - Public Directory Bridge
// Uses Supabase as the primary source and keeps index.html data as a safe fallback.

(function(){

    const CATEGORY_ALIASES = {
        "সরকারি সেবা":"government",
        "সরকারি ও ইউনিয়ন সেবা":"government",
        "শিক্ষা":"education",
        "শিক্ষা প্রতিষ্ঠান":"education",
        "স্বাস্থ্য":"health",
        "স্বাস্থ্যসেবা":"health",
        "ব্যবসা":"business",
        "ব্যবসা ও দোকান":"business",
        "ব্যাংক":"banking",
        "ধর্মীয় প্রতিষ্ঠান":"religion",
        "জরুরি নম্বর":"emergency",
        "ব্লাড ডোনার্স":"blood",
        "পুলিশ":"police",
        "ফায়ার সার্ভিস":"fire",
        "অ্যাম্বুলেন্স":"ambulance",
        "ডাক্তার":"doctor",
        "বিদ্যুৎ":"electricity",
        "গুরুত্বপূর্ণ স্থান":"places",
        "গুরুত্বপূর্ণ ব্যক্তিবর্গ":"people",
        "ডাকঘর":"post",
        "যাতায়াত ও যোগাযোগ":"transport",
        "কৃষি ও স্থানীয় সেবা":"agriculture",
        "সামাজিক সংগঠন":"social"
    };

    function normalizeCategory(value){
        const raw=String(value || "").trim();
        if(!raw) return "";
        return CATEGORY_ALIASES[raw] || raw;
    }

    function normalizeSubcategory(category, value){
        const raw=String(value || "").trim();
        if(!raw) return "";

        try{
            if(typeof subcategories !== "undefined"){
                const list=subcategories[category] || [];
                const match=list.find(item => item[0]===raw || item[1]===raw);
                if(match) return match[0];
            }
        }catch(error){}

        return raw;
    }

    function toSiteItem(row){
        const category=normalizeCategory(row.cat);
        return {
            id:row.id,
            cat:category,
            subcat:normalizeSubcategory(category,row.subcat),
            name:row.name || "",
            phone:row.phone || "",
            map:row.map_url || "",
            address:row.address || "",
            desc:row.description || "",
            image_url:row.image_url || ""
        };
    }

    function refreshExistingUI(){
        if(typeof homeRecentData !== "undefined"){
            homeRecentData = data.filter(x =>
                ["government:union","health:hospital","education:secondary","health:pharmacy"]
                .includes(`${x.cat}:${x.subcat}`)
            );
        }

        if(typeof renderCats === "function") renderCats();
        if(typeof renderMenu === "function") renderMenu();
        if(typeof renderCards === "function") renderCards(homeRecentData);

        const searchInput=document.getElementById("search");
        if(searchInput && searchInput.value.trim() && typeof renderLiveResults === "function"){
            renderLiveResults(searchInput.value);
        }
    }

    async function loadDirectoryFromSupabase(){
        if(!window.supabaseClient){
            console.warn("Directory: Supabase client not ready; using built-in fallback data.");
            return;
        }

        try{
            const {data:rows,error}=await window.supabaseClient
                .from("directory_items")
                .select("*")
                .eq("active",true)
                .order("sort_order",{ascending:true})
                .order("id",{ascending:true});

            if(error) throw error;

            // Keep the original built-in records only when the database has no published records.
            if(!rows || rows.length===0){
                console.info("Directory: no active Supabase rows; built-in fallback remains visible.");
                return;
            }

            data = rows.map(toSiteItem);
            refreshExistingUI();
            console.log("Directory loaded from Supabase:", data.length);
        }catch(error){
            console.error("Directory loading error:", error);
            // Do not blank the website if Supabase is temporarily unavailable.
        }
    }

    window.VoiceOfGoilaDirectory={
        reload:loadDirectoryFromSupabase
    };

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", loadDirectoryFromSupabase);
    }else{
        loadDirectoryFromSupabase();
    }

})();
