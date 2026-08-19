// Voice of Goila - Public Website Settings CMS
// Reads the existing public.website_settings table and applies values without changing the page layout.

(function(){
    function clean(v){ return String(v ?? "").trim(); }

    function setText(selector,value){
        const el=document.querySelector(selector);
        if(el && value) el.textContent=value;
    }

    function setImage(selector,url,alt){
        if(!url) return;
        const img=document.querySelector(selector);
        if(!img) return;
        img.src=url;
        if(alt) img.alt=alt;
    }

    function freshAnchor(id){
        const old=document.getElementById(id);
        if(!old) return null;
        const fresh=old.cloneNode(true);
        old.replaceWith(fresh);
        return fresh;
    }

    function configureAnchor(el,href,newTab=true){
        if(!el) return;
        if(href){
            el.href=href;
            if(newTab){ el.target="_blank"; el.rel="noopener"; }
            else{ el.removeAttribute("target"); el.removeAttribute("rel"); }
            el.style.display="inline-flex";
        }else{
            el.href="#";
            el.style.display="none";
        }
    }

    function ensureSocialButton(id,title,symbol){
        let el=document.getElementById(id);
        if(el) return el;
        const box=document.querySelector(".social-links");
        if(!box) return null;
        el=document.createElement("a");
        el.id=id;
        el.className="social-btn";
        el.href="#";
        el.title=title;
        el.setAttribute("aria-label",title);
        el.style.fontWeight="800";
        el.style.fontSize="18px";
        el.textContent=symbol;
        box.appendChild(el);
        return el;
    }

    function whatsappUrl(value){
        const v=clean(value);
        if(!v) return "";
        if(/^https?:\/\//i.test(v)) return v;
        const digits=v.replace(/\D/g,"");
        return digits ? "https://wa.me/"+digits : "";
    }

    function renderContactInfo(row){
        const parent=document.querySelector(".footer-grid > div:first-child");
        if(!parent) return;
        let box=document.getElementById("siteContactInfo");
        if(!box){
            box=document.createElement("div");
            box.id="siteContactInfo";
            box.style.marginTop="12px";
            box.style.fontSize="14px";
            box.style.lineHeight="1.8";
            parent.appendChild(box);
        }
        box.innerHTML="";
        const items=[];
        if(clean(row.phone)) items.push(["📞 ",clean(row.phone),"tel:"+clean(row.phone).replace(/\s+/g,"")]);
        if(clean(row.email)) items.push(["✉️ ",clean(row.email),"mailto:"+clean(row.email)]);
        if(clean(row.address)) items.push(["📍 ",clean(row.address),""]);
        items.forEach(([prefix,text,href])=>{
            const line=document.createElement("div");
            line.appendChild(document.createTextNode(prefix));
            if(href){
                const a=document.createElement("a");
                a.href=href;
                a.textContent=text;
                a.style.color="inherit";
                a.style.textDecoration="none";
                line.appendChild(a);
            }else{
                line.appendChild(document.createTextNode(text));
            }
            box.appendChild(line);
        });
        box.style.display=items.length ? "block" : "none";
    }

    function applySettings(row){
        const siteName=clean(row.site_name) || "Voice of Goila";
        document.title=siteName;
        setText(".brand-text h1",siteName);
        setText(".footer-brand h4",siteName);
        const brand=document.querySelector("a.brand");
        if(brand) brand.setAttribute("aria-label",siteName+" home");

        const logo=clean(row.logo_url);
        if(logo){
            setImage(".brand-icon img",logo,siteName+" logo");
            setImage(".footer-brand img",logo,siteName+" logo");
        }

        const favicon=clean(row.favicon_url);
        if(favicon){
            let icon=document.querySelector('link[rel~="icon"]');
            if(!icon){
                icon=document.createElement("link");
                icon.rel="icon";
                document.head.appendChild(icon);
            }
            icon.href=favicon;
        }

        const fb=freshAnchor("facebookLink");
        configureAnchor(fb,clean(row.facebook),true);

        const email=freshAnchor("emailLink");
        configureAnchor(email,clean(row.email) ? "mailto:"+clean(row.email) : "",false);

        const yt=ensureSocialButton("youtubeLink","YouTube","▶");
        configureAnchor(yt,clean(row.youtube),true);

        const wa=ensureSocialButton("whatsappLink","WhatsApp","☎");
        configureAnchor(wa,whatsappUrl(row.whatsapp),true);

        renderContactInfo(row);
    }

    async function loadPublicWebsiteSettings(){
        if(!window.supabaseClient) return;
        const {data,error}=await window.supabaseClient
            .from("website_settings")
            .select("*")
            .order("id",{ascending:true})
            .limit(1);
        if(error){
            console.warn("Website settings unavailable; using built-in fallback.",error.message);
            return;
        }
        if(data && data[0]) applySettings(data[0]);
    }

    loadPublicWebsiteSettings();
})();
