// Voice of Goila - Complete public directory + dynamic category bridge
// Loads Supabase directory/category data into the existing homepage UI while preserving legacy slugs.
(function(){
  const knownCatNameMap={"শিক্ষা":"education","কোচিং / হোম টিউটর":"coaching"};
  const knownSubNameMap={"কোচিং সেন্টার":"coaching-center","হোম টিউটর":"home-tutor","বিষয়ভিত্তিক শিক্ষক":"subject-tutor","ভর্তি / এডমিশন কোচিং":"admission"};
  const clean=v=>String(v??"").trim();
  const lower=v=>clean(v).toLowerCase();

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
      let slug=knownSubNameMap[raw]||raw;
      const list=(typeof subcategories!=="undefined"?(subcategories[parentSlug]||[]):[]);
      const staticMatch=list.some(x=>String(x[0])===slug);
      if(!staticMatch && !/^[a-z0-9][a-z0-9-]*$/i.test(slug)) slug=`cms-sub-${s.id}`;
      if(!list.some(x=>String(x[0])===slug)) list.push([slug,raw]);
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
