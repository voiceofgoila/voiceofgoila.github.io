// Voice of Goila - Complete public directory + dynamic category bridge
// Loads Supabase directory/category data into the existing homepage UI while preserving legacy slugs.
(function(){
  const knownCatNameMap={
    "শিক্ষা":"education",
    "শিক্ষা প্রতিষ্ঠান":"education",
    "coaching":"coaching",
    "কোচিং / হোম টিউটর":"coaching",
    "কোচিং সেন্টার / হোম টিউটর":"coaching",
    "সামাজিক সংগঠন":"social",
    "স্বাস্থ্য":"health",
    "স্বাস্থ্যসেবা":"health",
    "সরকারি সেবা":"government",
    "সরকারি ও ইউনিয়ন সেবা":"government",
    "আইন-শৃঙ্খলা":"police",
    "আইন-শৃংখলা":"police",
    "ব্যবসা ও বাণিজ্য":"business",
    "ব্যবসা ও দোকান":"business",
    "কৃষি":"agriculture",
    "ধর্মীয় প্রতিষ্ঠান":"religion",
    "ধর্মীয় প্রতিষ্ঠান":"religion",
    "পরিবহন":"transport",
    "যাতায়াত ও যোগাযোগ":"transport",
    "আবাসন ও নির্মাণ":"business",
    "অন্যান্য":"places"
  };
  const knownSubNameMap={"কোচিং সেন্টার":"coaching-center","হোম টিউটর":"home-tutor","বিষয়ভিত্তিক শিক্ষক":"subject-tutor","ভর্তি / এডমিশন কোচিং":"admission"};
  const clean=v=>String(v??"").trim();
  const lower=v=>clean(v).toLowerCase();

  // Keep the homepage taxonomy clean. Database rows may contain old/duplicate
  // labels, but built-in categories should show only the canonical list from
  // index.html. Common legacy labels are mapped to those canonical slugs.
  const builtInSubParents=new Set(
    typeof subcategories!=="undefined" ? Object.keys(subcategories) : []
  );
  const subAliasesByParent={
    government:{
      "ইউনিয়ন পরিষদ":"union",
      "উপজেলা সরকারি কর্মকর্তা":"upazila",
      "উপজেলা কর্মকর্তা":"upazila",
      "অন্যান্য সরকারি অফিস":"govt-office",
      "সরকারি অফিস":"govt-office",
      "সরকারি সেবা":"public-service"
    },
    education:{
      "প্রাথমিক বিদ্যালয়":"primary",
      "প্রাথমিক বিদ্যালয়":"primary",
      "প্রাথমিক স্কুল":"primary",
      "মাধ্যমিক বিদ্যালয়":"secondary",
      "মাধ্যমিক বিদ্যালয়":"secondary",
      "মাধ্যমিক স্কুল":"secondary",
      "কলেজ":"college",
      "মাদ্রাসা":"madrasa",
      "শিক্ষক ও কর্মচারী":"teachers",
      "অন্যান্য শিক্ষা প্রতিষ্ঠান":"other"
    },
    coaching:{
      "কোচিং সেন্টার":"coaching-center",
      "হোম টিউটর":"home-tutor",
      "বিষয়ভিত্তিক শিক্ষক":"subject-tutor",
      "বিষয়ভিত্তিক শিক্ষক":"subject-tutor",
      "ভর্তি / এডমিশন কোচিং":"admission",
      "ভর্তি/এডমিশন কোচিং":"admission",
      "অন্যান্য":"other"
    },
    health:{
      "হাসপাতাল/ক্লিনিক":"hospital",
      "হাসপাতাল":"hospital",
      "ক্লিনিক":"hospital",
      "ডাক্তার":"doctor",
      "ফার্মেসি":"pharmacy",
      "ডায়াগনস্টিক/ল্যাব":"diagnostic",
      "ডায়াগনস্টিক/ল্যাব":"diagnostic",
      "ডায়াগনস্টিক":"diagnostic",
      "অ্যাম্বুলেন্স":"ambulance"
    },
    business:{
      "মুদি দোকান":"grocery",
      "হোটেল/রেস্টুরেন্ট":"restaurant",
      "রেস্টুরেন্ট":"restaurant",
      "হোটেল":"restaurant",
      "মিষ্টান্ন ভান্ডার/বেকারি":"sweets",
      "মিষ্টির দোকান":"sweets",
      "লাইব্রেরি/স্টেশনারি":"library",
      "বিকাশ/নগদ/রকেট এজেন্ট":"mfs",
      "কাপড় ও ফ্যাশন":"fashion",
      "কাপড় ও ফ্যাশন":"fashion",
      "টেইলার্স":"tailor",
      "কসমেটিকস":"cosmetics",
      "মোবাইল/ইলেকট্রনিক্স":"mobile",
      "মোবাইল শপ":"mobile",
      "ইলেকট্রনিক্স":"mobile",
      "মোবাইল সার্ভিসিং":"mobile-service",
      "কম্পিউটার/ফটোকপি/অনলাইন সেবা":"computer",
      "কম্পিউটার/অনলাইন সেবা":"computer",
      "হার্ডওয়্যার/নির্মাণ সামগ্রী":"hardware",
      "হার্ডওয়্যার/নির্মাণ সামগ্রী":"hardware",
      "হার্ডওয়্যার":"hardware",
      "হার্ডওয়্যার":"hardware",
      "কাঁচামাল/পাইকারি":"raw-material",
      "ফার্নিচার":"furniture",
      "সেলুন/পার্লার":"salon",
      "কৃষি উপকরণ":"agri",
      "অন্যান্য ব্যবসা/সেবা":"service"
    },
    banking:{
      "ব্যাংক শাখা":"bank",
      "ব্যাংক":"bank",
      "atm":"atm",
      "ব্যাংক এজেন্ট":"agent",
      "বিকাশ/নগদ/রকেট":"mfs"
    },
    religion:{
      "মসজিদ":"mosque",
      "ধর্মীয় শিক্ষা":"madrasa",
      "ধর্মীয় শিক্ষা":"madrasa",
      "অন্যান্য ধর্মীয় প্রতিষ্ঠান":"other",
      "অন্যান্য ধর্মীয় প্রতিষ্ঠান":"other"
    },
    post:{
      "ডাকঘর":"post-office",
      "পোস্ট অফিস":"post-office",
      "কুরিয়ার/ডেলিভারি":"courier",
      "কুরিয়ার/ডেলিভারি":"courier"
    },
    transport:{
      "বাস/গণপরিবহন":"bus",
      "বাস":"bus",
      "ডাক/কুরিয়ার":"courier",
      "ডাক/কুরিয়ার":"courier",
      "গ্যারেজ/মেরামত":"garage",
      "অন্যান্য যোগাযোগ সেবা":"other"
    },
    agriculture:{
      "কৃষি অফিস/কর্মকর্তা":"agri-office",
      "কৃষি সেবা":"service",
      "প্রাণিসম্পদ":"livestock",
      "মৎস্য":"fisheries",
      "বীজ/সার/কৃষি উপকরণ":"shop"
    },
    social:{
      "সামাজিক সংগঠন":"social-org",
      "ক্লাব/যুব সংগঠন":"club",
      "এনজিও/স্বেচ্ছাসেবী সংগঠন":"ngo"
    }
  };
  function canonicalSubSlug(parentSlug,raw,list){
    const key=lower(raw);
    const byLabel=(list||[]).find(x=>lower(x[1])===key);
    if(byLabel)return String(byLabel[0]);
    const aliases=subAliasesByParent[parentSlug]||{};
    const alias=aliases[key];
    if(alias&&(list||[]).some(x=>String(x[0])===String(alias)))return String(alias);
    const known=knownSubNameMap[raw];
    if(known&&(list||[]).some(x=>String(x[0])===String(known)))return String(known);
    return null;
  }

  async function load(){
    if(!window.supabaseClient)return;
    const [dirRes,catRes,subRes]=await Promise.all([
      window.supabaseClient.from("directory_items").select("id,cat,subcat,name,phone,map_url,address,description,image_url,active,featured,sort_order").eq("active",true).order("featured",{ascending:false}).order("sort_order",{ascending:true}).order("id",{ascending:false}),
      window.supabaseClient.from("categories").select("id,name").order("id"),
      window.supabaseClient.from("sub_categories").select("id,category_id,name").order("id")
    ]);
    if(dirRes.error){console.warn("Directory load failed; fallback content kept.",dirRes.error.message);return;}

    const catRows=catRes.data||[], subRows=subRes.data||[];
    const existingCatSlugs=new Set(typeof categories!=="undefined"?categories.map(c=>String(c[2])):[]);
    const catSlugById=new Map(), catSlugByRaw=new Map(), catRawCandidates=new Map();

    // Map DB categories to existing frontend slugs when possible; otherwise add a safe dynamic category.
    for(const c of catRows){
      const raw=clean(c.name); if(!raw)continue;
      let slug=knownCatNameMap[raw]||raw;
      if(!existingCatSlugs.has(slug)) slug=`cms-${c.id}`;
      catSlugById.set(String(c.id),slug);catSlugByRaw.set(lower(raw),slug);
      if(!catRawCandidates.has(slug))catRawCandidates.set(slug,[]);catRawCandidates.get(slug).push(raw);
      if(typeof categories!=="undefined" && !categories.some(x=>String(x[2])===slug)){
        categories.push(["📌",raw,slug]); existingCatSlugs.add(slug);
      }
      if(typeof subcategories!=="undefined" && !Array.isArray(subcategories[slug])) subcategories[slug]=[];
    }

    window.vogCategoryRawBySlug={};
    for(const [slug,vals] of catRawCandidates.entries()){
      window.vogCategoryRawBySlug[slug]=vals.find(v=>v===slug)||vals[0]||slug;
    }

    const subSlugByRawKey=new Map(), subRawCandidates=new Map();
    for(const s of subRows){
      const parentSlug=catSlugById.get(String(s.category_id)); if(!parentSlug)continue;
      const raw=clean(s.name); if(!raw)continue;
      const list=(typeof subcategories!=="undefined"?(subcategories[parentSlug]||[]):[]);
      const canonical=canonicalSubSlug(parentSlug,raw,list);
      let slug=canonical||knownSubNameMap[raw]||raw;

      if(builtInSubParents.has(parentSlug)){
        // Built-in category: never append duplicate/legacy DB labels to the
        // public subcategory grid. Map known aliases; keep unknown values only
        // for data compatibility, not as extra UI buttons.
        if(canonical)slug=canonical;
      }else{
        // Truly custom CMS category: keep its subcategories, but de-duplicate
        // both by slug and by visible label.
        const existingByLabel=list.find(x=>lower(x[1])===lower(raw));
        if(existingByLabel){
          slug=String(existingByLabel[0]);
        }else{
          if(!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) slug=`cms-sub-${s.id}`;
          if(!list.some(x=>String(x[0])===String(slug))) list.push([slug,raw]);
        }
      }
      if(typeof subcategories!=="undefined") subcategories[parentSlug]=list;
      const parentRaw=(catRows.find(c=>String(c.id)===String(s.category_id))||{}).name||"";
      subSlugByRawKey.set(lower(parentRaw)+"::"+lower(raw),slug);
      const key=parentSlug+"::"+slug;if(!subRawCandidates.has(key))subRawCandidates.set(key,[]);subRawCandidates.get(key).push(raw);
    }
    window.vogSubcategoryRawBySlug={};
    for(const [key,vals] of subRawCandidates.entries()){
      const slug=key.split("::").slice(1).join("::");
      window.vogSubcategoryRawBySlug[key]=vals.find(v=>v===slug)||vals[0]||slug;
    }

    const mapped=(dirRes.data||[]).map(r=>{
      const rawCat=clean(r.cat), rawSub=clean(r.subcat);
      const catSlug=catSlugByRaw.get(lower(rawCat))||knownCatNameMap[rawCat]||rawCat;
      const subSlug=subSlugByRawKey.get(lower(rawCat)+"::"+lower(rawSub))||knownSubNameMap[rawSub]||rawSub;
      return {id:r.id,cat:catSlug,subcat:subSlug,name:r.name||"",phone:r.phone||"",map:r.map_url||"",address:r.address||"",desc:r.description||"",image:r.image_url||"",image_url:r.image_url||"",active:r.active!==false,featured:!!r.featured,sort_order:Number(r.sort_order||0)};
    });

    try{
      if(typeof data!=="undefined"&&Array.isArray(data)) data.splice(0,data.length,...mapped);
      if(typeof homeRecentData!=="undefined") homeRecentData=mapped.slice(0,8);
      window.allDirectory=mapped;
      if(typeof renderCats==="function")renderCats();
      if(typeof renderMenu==="function")renderMenu();
      if(typeof renderCards==="function")renderCards(mapped.slice(0,8),"সাম্প্রতিক তথ্য");
      const count=document.getElementById("count");if(count&&typeof visibleCategories==="function")count.textContent=visibleCategories().length+"+";
    }catch(e){console.warn("Directory UI refresh skipped",e);}
  }
  window.loadPublicDirectory=load;
  if(document.readyState==="loading")window.addEventListener("load",()=>setTimeout(load,120),{once:true});else setTimeout(load,120);
})();
