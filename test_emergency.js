
(function(){
 'use strict';
 const section=new URLSearchParams(location.search).get('section');
 if(section!=='emergency')return;
 document.body.classList.add('vog-emergency-page','vog-category-view');
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const phone=v=>String(v||'').replace(/[^0-9+]/g,'');
 const mount=document.createElement('div');mount.id='vogEmergencyReliable';mount.setAttribute('role','region');mount.setAttribute('aria-label','জরুরি সেবার নম্বর');
 mount.innerHTML='<div class="container"><div class="vog-er-grid" id="vogEmergencyReliableGrid" aria-live="polite"></div></div>';
 const main=document.querySelector('main');
 const before=document.getElementById('categorySection');
 if(main)main.insertBefore(mount,before||main.firstChild);
 const grid=document.getElementById('vogEmergencyReliableGrid');
 const known=[{icon:'🚔',name:'জাতীয় জরুরি সেবা',note:'পুলিশ • ফায়ার • অ্যাম্বুলেন্স',phone:'999'},{icon:'🏥',name:'জাতীয় স্বাস্থ্য সহায়তা',note:'সরকারি স্বাস্থ্য সহায়তা',phone:'16263'}];
 function directoryEntries(){
  const rows=Array.isArray(window.allDirectory)?window.allDirectory:(typeof data!=='undefined'&&Array.isArray(data)?data:[]);
  return rows.filter(x=>x&&x.phone&&/^(emergency|police|fire|ambulance|electricity)$/i.test(String(x.cat||''))).map(x=>({icon:'☎️',name:x.name,note:x.description||x.address||'',phone:x.phone}));
 }
 function configured(){try{return typeof emergencyNumbers!=='undefined'&&Array.isArray(emergencyNumbers)?emergencyNumbers:[]}catch(e){return []}}
 let dbEntries=[];
 function paint(){
  const all=[...dbEntries,...configured(),...directoryEntries(),...known];const seen=new Set();
  const rows=all.filter(x=>{const key=phone(x.phone);if(!key||seen.has(key))return false;seen.add(key);return true;});
  grid.innerHTML=rows.map(x=>'<article class="vog-er-card"><h3>'+esc(x.icon||'☎️')+' '+esc(x.name||'জরুরি সেবা')+'</h3><p>'+esc(x.note||'')+'</p><div class="vog-er-phone">☎ '+esc(x.phone)+'</div><div class="vog-er-actions"><a href="tel:'+esc(phone(x.phone))+'">📞 কল করুন</a><button type="button" data-name="'+esc(x.name||'জরুরি সেবা')+'" data-phone="'+esc(x.phone)+'">↗ শেয়ার</button></div></article>').join('');
  grid.querySelectorAll('button').forEach(b=>b.addEventListener('click',async()=>{const message=b.dataset.name+' — '+b.dataset.phone;try{if(navigator.share){await navigator.share({title:b.dataset.name,text:message,url:location.href});return;}}catch(e){if(e.name==='AbortError')return;}try{await navigator.clipboard.writeText(message);alert('নম্বর কপি হয়েছে');}catch(e){prompt('নম্বর কপি করুন',message)}}));
  const count=document.getElementById('vog42Counter');if(count)count.textContent=String(rows.length);
  const heading=document.getElementById('vogCategoryHeading');if(heading)heading.textContent='🚨 জরুরি সেবা';
 }
 paint();
 async function fetchRows(){if(!window.supabaseClient)return;try{const r=await window.supabaseClient.from('emergency_numbers').select('*').eq('active',true);if(!r.error&&Array.isArray(r.data)){dbEntries=r.data;paint();}else if(r.error)console.warn('Emergency numbers query:',r.error.message);}catch(e){console.warn('Emergency numbers query failed',e)}}
 fetchRows();
 window.addEventListener('vog:directory-ready',paint);
 window.addEventListener('vog:emergency-ready',()=>{paint();fetchRows()});
 window.addEventListener('load',()=>{paint();fetchRows()},{once:true});
})();
