// Voice of Goila - Complete public directory + dynamic category bridge
// Fresh-data-first version:
// Prevents old/fallback directory data from flashing before Supabase finishes loading.

(function(){

  const knownCatNameMap={
    "শিক্ষা":"education",
    "শিক্ষা প্রতিষ্ঠান":"education",
    "coaching":"coaching",
    "কোচিং / হোম টিউটর":"coaching",
    "কোচিং সেন্টার / হোম টিউটর":"coaching",
    "সামাজিক সংগঠন":"social",
    "গুরুত্বপূর্ণ ব্যক্তিবর্গ":"people",
    "ডাকঘর":"post",
    "অ্যাম্বুলেন্স":"ambulance",
    "ডাক্তার":"doctor",
    "স্বাস্থ্য":"health",
    "স্বাস্থ্যসেবা":"health",
    "সরকারি সেবা":"government",
    "সরকারি ও ইউনিয়ন সেবা":"government",
    "আইন-শৃঙ্খলা":"police",
    "আইন-শৃংখলা":"police",
    "ব্যবসা ও বাণিজ্য":"business",
    "ব্যবসা ও দোকান":"business",
    "ধর্মীয় প্রতিষ্ঠান":"religion",
    "ধর্মীয় প্রতিষ্ঠান":"religion",
    "পরিবহন":"transport",
    "যাতায়াত ও যোগাযোগ":"transport",
    "আবাসন ও নির্মাণ":"business",
    "অন্যান্য":"places"
  };

  const knownSubNameMap={
    "কোচিং সেন্টার":"coaching-center",
    "হোম টিউটর":"home-tutor",
    "বিষয়ভিত্তিক শিক্ষক":"subject-tutor",
    "ভর্তি / এডমিশন কোচিং":"admission"
  };

  const clean=v=>String(v??"").trim();
  const lower=v=>clean(v).toLowerCase();


  // =========================================================
  // BUILT-IN TAXONOMY
  // =========================================================

  const builtInSubParents=new Set(
    typeof subcategories!=="undefined"
      ? Object.keys(subcategories)
      : []
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
      "অন্যান্য ব্যবসা/সেবা":"service",
      "ফার্মেসি":"pharmacy",
      "pharmacy":"pharmacy"
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

    people:{
      "দেশ-বিদেশে বিশ্ববিদ্যালয়ের শিক্ষার্থী":"university-student",
      "বিদেশে পড়াশোনা করা শিক্ষার্থী":"university-student",
      "পাবলিক বিশ্ববিদ্যালয়ের শিক্ষার্থী":"university-student",
      "abroad-student":"university-student",
      "public-university":"university-student",
      "উদ্ভাবক":"innovator",
      "innovator":"innovator"
    },

    post:{
      "ডাকঘর":"post-office",
      "পোস্ট অফিস":"post-office"
    },

    transport:{
      "বাস/গণপরিবহন":"bus",
      "বাস":"bus",
      "ডাক/কুরিয়ার":"courier",
      "ডাক/কুরিয়ার":"courier",
      "গ্যারেজ/মেরামত":"garage",
      "অন্যান্য যোগাযোগ সেবা":"other"
    },

    social:{
      "সামাজিক সংগঠন":"social-org",
      "ক্লাব/যুব সংগঠন":"club",
      "এনজিও/স্বেচ্ছাসেবী সংগঠন":"ngo"
    }

  };


  function canonicalSubSlug(parentSlug,raw,list){

    const key=lower(raw);

    const byLabel=(list||[])
      .find(x=>lower(x[1])===key);

    if(byLabel){
      return String(byLabel[0]);
    }

    const aliases=
      subAliasesByParent[parentSlug]||{};

    const alias=aliases[key];

    if(
      alias &&
      (list||[]).some(
        x=>String(x[0])===String(alias)
      )
    ){
      return String(alias);
    }

    const known=knownSubNameMap[raw];

    if(
      known &&
      (list||[]).some(
        x=>String(x[0])===String(known)
      )
    ){
      return String(known);
    }

    return null;
  }


  // =========================================================
  // FALLBACK DATA BACKUP
  // =========================================================

  let legacyPreviewCleared=false;


  function backupAndClearLegacyPreview(){

    if(legacyPreviewCleared){
      return;
    }

    try{

      if(
        typeof data!=="undefined" &&
        Array.isArray(data)
      ){

        // Keep a copy in case Supabase is unavailable.
        window.__vogLegacyDirectoryBackup=
          data.slice();

        // Remove old/fallback records immediately
        // so stale information does not flash.
        data.splice(
          0,
          data.length
        );

        legacyPreviewCleared=true;
      }


      if(
        typeof homeRecentData!=="undefined"
      ){
        homeRecentData=[];
      }


      window.allDirectory=[];


      // Clear previously rendered legacy recent cards
      // if the renderer is already available.
      if(
        typeof renderCards==="function"
      ){

        renderCards(
          [],
          "সাম্প্রতিক তথ্য"
        );
      }

    }catch(e){

      console.warn(
        "Legacy directory preview clear skipped",
        e
      );
    }
  }


  function restoreFallbackData(){

    const fallback=
      window.__vogLegacyDirectoryBackup||[];

    try{

      if(
        typeof data!=="undefined" &&
        Array.isArray(data)
      ){

        data.splice(
          0,
          data.length,
          ...fallback
        );
      }


      if(
        typeof homeRecentData!=="undefined"
      ){
        homeRecentData=
          fallback.slice(0,2);
      }


      window.allDirectory=fallback;


      if(
        typeof renderCards==="function"
      ){

        renderCards(
          fallback.slice(0,2),
          "সাম্প্রতিক তথ্য"
        );
      }


      if(
        typeof renderCats==="function"
      ){
        renderCats();
      }


      if(
        typeof renderMenu==="function"
      ){
        renderMenu();
      }

    }catch(e){

      console.warn(
        "Fallback restore failed",
        e
      );
    }
  }


  // =========================================================
  // SUPABASE LOAD
  // =========================================================

  async function load(){

    if(!window.supabaseClient){
      return;
    }


    const [
      dirRes,
      catRes,
      subRes
    ]=await Promise.all([

      window.supabaseClient
        .from("directory_items")
        .select(
          "id,cat,subcat,name,phone,map_url,address,description,image_url,active,featured,sort_order"
        )
        .eq("active",true)
        .order(
          "featured",
          {ascending:false}
        )
        .order(
          "sort_order",
          {ascending:true}
        )
        .order(
          "id",
          {ascending:false}
        ),


      window.supabaseClient
        .from("categories")
        .select(
          "id,name"
        )
        .order("id"),


      window.supabaseClient
        .from("sub_categories")
        .select(
          "id,category_id,name"
        )
        .order("id")

    ]);


    // If live directory request fails,
    // restore the original fallback content.
    if(dirRes.error){

      console.warn(
        "Directory load failed; fallback content restored.",
        dirRes.error.message
      );

      restoreFallbackData();

      return;
    }


    const catRows=
      catRes.data||[];

    const subRows=
      subRes.data||[];


    const existingCatSlugs=
      new Set(
        typeof categories!=="undefined"
          ? categories.map(
              c=>String(c[2])
            )
          : []
      );


    const catSlugById=new Map();

    const catSlugByRaw=new Map();

    const catRawCandidates=new Map();


    // =========================================================
    // CATEGORY MAPPING
    // =========================================================

    for(const c of catRows){

      const raw=clean(c.name);

      if(!raw){
        continue;
      }


      let slug=
        knownCatNameMap[raw]||raw;


      if(
        slug==="agriculture" ||
        lower(raw)==="কৃষি" ||
        lower(raw)==="কৃষি ও স্থানীয় সেবা"
      ){
        continue;
      }


      if(
        !existingCatSlugs.has(slug)
      ){
        slug=`cms-${c.id}`;
      }


      catSlugById.set(
        String(c.id),
        slug
      );


      catSlugByRaw.set(
        lower(raw),
        slug
      );


      if(
        !catRawCandidates.has(slug)
      ){
        catRawCandidates.set(
          slug,
          []
        );
      }


      catRawCandidates
        .get(slug)
        .push(raw);


      if(
        typeof categories!=="undefined" &&
        !categories.some(
          x=>String(x[2])===slug
        )
      ){

        categories.push(
          ["📌",raw,slug]
        );

        existingCatSlugs.add(slug);
      }


      if(
        typeof subcategories!=="undefined" &&
        !Array.isArray(
          subcategories[slug]
        )
      ){
        subcategories[slug]=[];
      }
    }


    window.vogCategoryRawBySlug={};


    for(
      const [slug,vals]
      of catRawCandidates.entries()
    ){

      window.vogCategoryRawBySlug[slug]=
        vals.find(v=>v===slug) ||
        vals[0] ||
        slug;
    }


    // =========================================================
    // SUBCATEGORY MAPPING
    // =========================================================

    const subSlugByRawKey=
      new Map();

    const subRawCandidates=
      new Map();


    for(const s of subRows){

      const parentSlug=
        catSlugById.get(
          String(s.category_id)
        );


      if(!parentSlug){
        continue;
      }


      const raw=
        clean(s.name);


      if(!raw){
        continue;
      }


      const list=
        typeof subcategories!=="undefined"
          ? (subcategories[parentSlug]||[])
          : [];


      const canonical=
        canonicalSubSlug(
          parentSlug,
          raw,
          list
        );


      let slug=
        canonical ||
        knownSubNameMap[raw] ||
        raw;


      if(
        builtInSubParents.has(
          parentSlug
        )
      ){

        // Built-in categories:
        // map known aliases only.
        // Do not create duplicate public buttons.
        if(canonical){
          slug=canonical;
        }

      }else{

        // Custom CMS categories:
        // retain custom subcategories.
        const existingByLabel=
          list.find(
            x=>lower(x[1])===lower(raw)
          );


        if(existingByLabel){

          slug=
            String(
              existingByLabel[0]
            );

        }else{

          if(
            !/^[a-z0-9][a-z0-9-]*$/i
              .test(slug)
          ){
            slug=`cms-sub-${s.id}`;
          }


          if(
            !list.some(
              x=>
                String(x[0])===
                String(slug)
            )
          ){

            list.push(
              [slug,raw]
            );
          }
        }
      }


      if(
        typeof subcategories!=="undefined"
      ){
        subcategories[parentSlug]=list;
      }


      const parentRaw=
        (
          catRows.find(
            c=>
              String(c.id)===
              String(s.category_id)
          )||{}
        ).name||"";


      subSlugByRawKey.set(
        lower(parentRaw)
          +"::"+
        lower(raw),
        slug
      );


      const key=
        parentSlug+
        "::"+
        slug;


      if(
        !subRawCandidates.has(key)
      ){
        subRawCandidates.set(
          key,
          []
        );
      }


      subRawCandidates
        .get(key)
        .push(raw);
    }


    window.vogSubcategoryRawBySlug={};


    for(
      const [key,vals]
      of subRawCandidates.entries()
    ){

      const slug=
        key
          .split("::")
          .slice(1)
          .join("::");


      window.vogSubcategoryRawBySlug[key]=
        vals.find(v=>v===slug) ||
        vals[0] ||
        slug;
    }


    // =========================================================
    // DIRECTORY ITEM MAPPING
    // =========================================================

    const mapped=
      (dirRes.data||[])
        .map(r=>{

          const rawCat=
            clean(r.cat);

          const rawSub=
            clean(r.subcat);


          let catSlug=
            catSlugByRaw.get(
              lower(rawCat)
            ) ||
            knownCatNameMap[rawCat] ||
            rawCat;


          let subSlug=
            subSlugByRawKey.get(
              lower(rawCat)
              +"::"+
              lower(rawSub)
            ) ||
            knownSubNameMap[rawSub] ||
            rawSub;


          // Public taxonomy compatibility
          // without destructive DB migration.

          if(
            catSlug==="people" &&
            [
              "abroad-student",
              "public-university"
            ].includes(
              String(subSlug)
            )
          ){
            subSlug=
              "university-student";
          }


          if(
            catSlug==="health" &&
            (
              subSlug==="pharmacy" ||
              [
                "pharmacy",
                "ফার্মেসি"
              ].includes(
                lower(rawSub)
              )
            )
          ){

            catSlug="business";

            subSlug="pharmacy";
          }


          if(
            catSlug==="post" &&
            [
              "courier",
              "কুরিয়ার/ডেলিভারি",
              "কুরিয়ার/ডেলিভারি"
            ].includes(
              lower(rawSub)
            )
          ){
            subSlug="courier";
          }


          return {

            id:r.id,

            cat:catSlug,

            subcat:subSlug,

            name:r.name||"",

            phone:r.phone||"",

            map:r.map_url||"",

            address:r.address||"",

            desc:r.description||"",

            image:r.image_url||"",

            image_url:r.image_url||"",

            active:
              r.active!==false,

            featured:
              !!r.featured,

            sort_order:
              Number(
                r.sort_order||0
              )
          };

        })

        .filter(
          x=>
            x.cat!=="agriculture" &&
            !(
              x.cat==="post" &&
              x.subcat==="courier"
            )
        );


    // =========================================================
    // FRESH UI UPDATE
    // =========================================================

    try{

      if(
        typeof data!=="undefined" &&
        Array.isArray(data)
      ){

        data.splice(
          0,
          data.length,
          ...mapped
        );
      }


      if(
        typeof homeRecentData!=="undefined"
      ){

        homeRecentData=
          mapped.slice(0,2);
      }


      window.allDirectory=
        mapped;


      if(
        typeof renderCats==="function"
      ){
        renderCats();
      }


      if(
        typeof renderMenu==="function"
      ){
        renderMenu();
      }


      if(
        typeof renderCards==="function"
      ){

        renderCards(
          mapped.slice(0,2),
          "সাম্প্রতিক তথ্য"
        );
      }


      const count=
        document.getElementById(
          "count"
        );


      if(
        count &&
        typeof visibleCategories===
          "function"
      ){

        count.textContent=
          visibleCategories().length+
          "+";
      }

    }catch(e){

      console.warn(
        "Directory UI refresh skipped",
        e
      );
    }
  }


  // =========================================================
  // FRESH START
  // =========================================================

  window.loadPublicDirectory=load;


  let freshStartAttempts=0;


  function startFreshDirectory(){

    // Remove old/fallback preview immediately.
    backupAndClearLegacyPreview();


    // Supabase client may initialize slightly
    // after this script loads.
    if(!window.supabaseClient){

      freshStartAttempts++;


      // Retry for approximately 5 seconds.
      if(freshStartAttempts<200){

        setTimeout(
          startFreshDirectory,
          25
        );

        return;
      }


      console.warn(
        "Supabase client was not available; restoring fallback directory."
      );


      restoreFallbackData();

      return;
    }


    // Supabase is ready.
    // Load live data immediately.
    load();
  }


  // IMPORTANT:
  // Do not wait for window.load + 120ms.
  // Start immediately so stale/fallback data
  // does not remain visible during refresh.
  startFreshDirectory();

})();
