(function(){
"use strict";
/* ===== EDIT FOR EACH CLINIC ===== */
var CONFIG={
 wa:"919405409215",           // WhatsApp number with country code, digits only
 tel:"+919405409215",         // phone for call links
 phoneText:"+91 94054 09215", // number shown on the page
 mapQuery:"Vishrambag, Sangli, Maharashtra"
};
/* Opening hours, Monday first. Each day: list of [open, close] in 24h time, or [] when closed. Sample timings. */
var HOURS=[
 [["10:00","14:00"],["17:00","21:00"]],
 [["10:00","14:00"],["17:00","21:00"]],
 [["10:00","14:00"],["17:00","21:00"]],
 [["10:00","14:00"],["17:00","21:00"]],
 [["10:00","14:00"],["17:00","21:00"]],
 [["10:00","14:00"],["17:00","21:00"]],
 []
];
/* ================================ */

var DAYS=[["सोमवार","Monday"],["मंगळवार","Tuesday"],["बुधवार","Wednesday"],["गुरुवार","Thursday"],["शुक्रवार","Friday"],["शनिवार","Saturday"],["रविवार","Sunday"]];
var root=document.documentElement;
function q(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function one(s,c){return (c||document).querySelector(s)}
function wa(t){return "https://wa.me/"+(CONFIG.wa||"")+"?text="+encodeURIComponent(t)}
function bi(mr,en){return '<span data-l="mr">'+mr+'</span><span data-l="en">'+en+'</span>'}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* preloader */
function hidePre(){var p=one(".preloader");if(p){p.classList.add("done");setTimeout(function(){p.remove()},450)}}
if(document.readyState==="complete")hidePre();else window.addEventListener("load",hidePre);
setTimeout(hidePre,1600);

/* language */
function setLang(l){
 root.lang=l;
 q("[data-set-lang]").forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-set-lang")===l))});
 try{localStorage.setItem("lang",l)}catch(e){}
}
q("[data-set-lang]").forEach(function(b){b.addEventListener("click",function(){setLang(b.getAttribute("data-set-lang"))})});
var saved=null;try{saved=localStorage.getItem("lang")}catch(e){}
setLang(saved==="en"?"en":"mr");

/* contact details + WhatsApp links */
q("[data-phone]").forEach(function(el){el.textContent=CONFIG.phoneText});
q("[data-call]").forEach(function(a){a.href=CONFIG.tel?"tel:"+CONFIG.tel:"#book"});
q("[data-wa]").forEach(function(a){
 a.href=wa(a.getAttribute("data-wa")||"नमस्कार, मला अपॉइंटमेंट हवी आहे. / Hello, I would like to book an appointment.");
 a.target="_blank";a.rel="noopener";
});
q("[data-year]").forEach(function(el){el.textContent=new Date().getFullYear()});

/* optional real photos: drop files into img/ and they replace the illustrations */
q("img.photo[data-src]").forEach(function(img){
 var t=new Image();
 t.onload=function(){img.src=t.src;img.classList.add("ok")};
 t.src=img.getAttribute("data-src");
});

/* hours table + live open/closed status */
function mins(s){var p=s.split(":");return +p[0]*60+ +p[1]}
function fmt(s,en){var m=mins(s),h=Math.floor(m/60),mm=m%60,h12=((h+11)%12)+1;
 var t=h12+(mm?":"+(mm<10?"0":"")+mm:"");
 return en?t+(h<12?" am":" pm"):(h<12?"सकाळी ":h<17?"दुपारी ":"संध्या. ")+t}
function status(){
 var now=new Date(),d=(now.getDay()+6)%7,m=now.getHours()*60+now.getMinutes(),today=HOURS[d];
 for(var i=0;i<today.length;i++){
  if(m>=mins(today[i][0])&&m<mins(today[i][1]))return{open:true,mr:"आत्ता उघडे · "+fmt(today[i][1])+" पर्यंत",en:"Open now · until "+fmt(today[i][1],true)};
 }
 for(var k=0;k<8;k++){
  var dd=(d+k)%7,list=HOURS[dd];
  for(var j=0;j<list.length;j++){
   if(k>0||mins(list[j][0])>m){
    var dayMr=k===0?"आज ":k===1?"उद्या ":DAYS[dd][0]+" ",dayEn=k===0?"today ":k===1?"tomorrow ":DAYS[dd][1]+" ";
    return{open:false,mr:"बंद · "+dayMr+fmt(list[j][0])+" वाजता उघडेल",en:"Closed · opens "+dayEn+"at "+fmt(list[j][0],true)};
   }
  }
 }
 return{open:false,mr:"बंद",en:"Closed"};
}
function paintStatus(){
 var s=status();
 q("[data-status]").forEach(function(el){el.className="status "+(s.open?"open":"closed");el.innerHTML=bi(s.mr,s.en)});
}
paintStatus();setInterval(paintStatus,60000);
var td=(new Date().getDay()+6)%7;
q("[data-hours]").forEach(function(tb){
 tb.innerHTML=HOURS.map(function(h,i){
  var v=h.length?h.map(function(r){return fmt(r[0],true)+"–"+fmt(r[1],true)}).join(", "):null;
  var vm=h.length?h.map(function(r){return fmt(r[0])+"–"+fmt(r[1]).replace(/^\S+ /,"")}).join(", "):null;
  return '<tr'+(i===td?' class="today"':'')+'><td>'+bi(DAYS[i][0],DAYS[i][1])+(i===td?' '+bi("(आज)","(today)"):'')+'</td><td>'+
   (v?bi(vm,v):'<span class="closed-txt">'+bi("बंद","Closed")+'</span>')+'</td></tr>';
 }).join("");
});

/* header: shrink, active link, scroll progress */
var hdr=one(".hdr"),totop=one(".totop"),ring=one(".totop .ring circle");
function onScroll(){
 var y=window.scrollY,max=document.documentElement.scrollHeight-innerHeight;
 if(hdr)hdr.classList.toggle("scrolled",y>10);
 if(totop){totop.classList.toggle("show",y>600);if(ring)ring.style.strokeDashoffset=String(150.8*(1-(max>0?y/max:0)))}
}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
if(totop)totop.addEventListener("click",function(){window.scrollTo({top:0,behavior:reduce?"auto":"smooth"})});
if("IntersectionObserver" in window){
 var links=q(".menu a[href^='#']");
 var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id)})}
 })},{rootMargin:"-45% 0px -50% 0px"});
 links.forEach(function(a){var s=one(a.getAttribute("href"));if(s)io.observe(s)});
}

/* mobile drawer */
var drawer=one(".drawer"),burger=one(".burger");
function setDrawer(open){
 if(!drawer)return;
 drawer.classList.toggle("open",open);drawer.setAttribute("aria-hidden",String(!open));
 if(burger)burger.setAttribute("aria-expanded",String(open));
 document.body.style.overflow=open?"hidden":"";
 if(open){var f=one(".close",drawer);if(f)f.focus()}else if(burger)burger.focus();
}
if(burger)burger.addEventListener("click",function(){setDrawer(true)});
q("[data-close]").forEach(function(el){el.addEventListener("click",function(){setDrawer(false)})});
q(".drawer nav a, .drawer .btn").forEach(function(a){a.addEventListener("click",function(){setDrawer(false)})});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&drawer&&drawer.classList.contains("open"))setDrawer(false)});

/* counters: final numbers are in the HTML; they count up once when scrolled into view */
if("IntersectionObserver" in window&&!reduce){
 var co=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;co.unobserve(e.target);
  var el=e.target,to=+el.getAttribute("data-count"),t0=null;
  function step(t){t0=t0||t;var p=Math.min((t-t0)/1400,1),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString("en-IN");if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
 })},{threshold:.6});
 q("[data-count]").forEach(function(el){if(el.getBoundingClientRect().top>innerHeight)co.observe(el)});
}

/* treatment finder */
var FIND={
 cold:{level:"soon",tmr:"या आठवड्यात",ten:"This week",nmr:"फिलिंग किंवा संवेदनशीलतेवर उपचार",nen:"Filling or sensitivity care",
  dmr:"थंड-गरम लागणे हे बहुतेक वेळा कीड किंवा झिजलेल्या इनॅमलचे लक्षण असते. वेदना काही सेकंदांपेक्षा जास्त टिकत असेल तर RCT ची गरज असू शकते.",
  den:"Sensitivity usually points to a cavity or worn enamel. If the pain lingers for more than a few seconds, a root canal may be needed.",vmr:"१ भेट",ven:"1 visit"},
 night:{level:"urgent",tmr:"आजच दाखवा",ten:"See us today",nmr:"रूट कॅनाल तपासणी (RCT)",nen:"Root canal check",
  dmr:"रात्री वाढणारी तीव्र वेदना म्हणजे दाताच्या आतील नसेत संसर्ग असू शकतो. लवकर उपचार केल्यास दात वाचवता येतो.",
  den:"Severe pain that gets worse at night often means infection inside the tooth. Early treatment usually saves the tooth.",vmr:"१–३ भेटी",ven:"1–3 visits"},
 gums:{level:"soon",tmr:"या आठवड्यात",ten:"This week",nmr:"स्केलिंग आणि हिरड्यांची काळजी",nen:"Scaling and gum care",
  dmr:"ब्रश करताना रक्त येणे हे हिरड्यांच्या सुजेचे पहिले लक्षण आहे. व्यावसायिक स्वच्छतेने बहुतेक वेळा पूर्ण बरे होते.",
  den:"Bleeding while brushing is the first sign of gum inflammation. A professional clean usually reverses it.",vmr:"१–२ भेटी",ven:"1–2 visits"},
 missing:{level:"routine",tmr:"सोयीनुसार",ten:"When convenient",nmr:"इम्प्लांट, ब्रिज किंवा कवळी",nen:"Implant, bridge or denture",
  dmr:"गेलेल्या दाताची जागा तशीच ठेवल्यास शेजारचे दात सरकतात. एक्स-रे पाहून तिन्ही पर्यायांचा खर्च आणि कालावधी समजावून सांगितला जातो.",
  den:"Leaving a gap lets neighbouring teeth drift. After an X-ray, the dentist explains the cost and timeline of all three options.",vmr:"योजनेनुसार",ven:"As planned"},
 crooked:{level:"routine",tmr:"सोयीनुसार",ten:"When convenient",nmr:"ब्रेसेस किंवा क्लिअर अलायनर",nen:"Braces or clear aligners",
  dmr:"वाकडे किंवा फट असलेले दात कोणत्याही वयात सरळ करता येतात. स्कॅन पाहून ब्रेसेस की अलायनर हे ठरवले जाते.",
  den:"Crooked or gapped teeth can be straightened at any age. A scan decides between braces and aligners.",vmr:"मासिक तपासणी",ven:"Monthly reviews"},
 stain:{level:"routine",tmr:"सोयीनुसार",ten:"When convenient",nmr:"स्वच्छता आणि व्हाइटनिंग",nen:"Cleaning and whitening",
  dmr:"चहा, तंबाखू किंवा टार्टरमुळे दात पिवळे दिसतात. आधी स्वच्छता, गरज असल्यास नंतर व्हाइटनिंग.",
  den:"Tea, tobacco or tartar make teeth look yellow. A clean comes first, then whitening if you still want it.",vmr:"१–२ भेटी",ven:"1–2 visits"},
 child:{level:"soon",tmr:"या आठवड्यात",ten:"This week",nmr:"लहान मुलांचे दंतोपचार",nen:"Children's dentistry",
  dmr:"दुधाच्या दातातील कीडही वेळेवर भरली पाहिजे, नाहीतर वेदना आणि पुढच्या दातांवर परिणाम होतो.",
  den:"Cavities in milk teeth still need treatment, or they cause pain and affect the adult teeth underneath.",vmr:"१+ भेट",ven:"1+ visits"}
};
var res=one("#finder-result");
function showFind(key,label){
 var f=FIND[key];if(!f||!res)return;
 var msg="नमस्कार, मला त्रास आहे: "+label.mr+". तपासणीसाठी वेळ हवी आहे. / Hello, my problem: "+label.en+". I would like a check-up.";
 res.innerHTML='<span class="tag '+f.level+'">'+bi(f.tmr,f.ten)+'</span>'+
  '<h3>'+bi(f.nmr,f.nen)+'</h3><p>'+bi(f.dmr,f.den)+'</p>'+
  '<div class="row"><span>'+bi("साधारण भेटी: ","Typical visits: ")+bi(f.vmr,f.ven)+'</span></div>'+
  '<a class="btn btn-wa" target="_blank" rel="noopener" href="'+esc(wa(msg))+'">'+bi("या त्रासासाठी वेळ घ्या","Book a check-up for this")+'</a>';
}
q(".sym").forEach(function(b){
 b.addEventListener("click",function(){
  q(".sym").forEach(function(x){x.setAttribute("aria-pressed","false")});
  b.setAttribute("aria-pressed","true");
  showFind(b.getAttribute("data-key"),{mr:one("[data-l=mr]",b).textContent,en:one("[data-l=en]",b).textContent});
 });
});

/* tabs */
var tabs=q("[role=tab]");
function selectTab(t,focus){
 tabs.forEach(function(x){var on=x===t;x.setAttribute("aria-selected",String(on));x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute("aria-controls"));if(p)p.hidden=!on});
 if(focus)t.focus();
}
tabs.forEach(function(t,i){
 t.addEventListener("click",function(){selectTab(t)});
 t.addEventListener("keydown",function(e){
  var k=e.key,n=null;
  if(k==="ArrowRight"||k==="ArrowDown")n=tabs[(i+1)%tabs.length];
  if(k==="ArrowLeft"||k==="ArrowUp")n=tabs[(i-1+tabs.length)%tabs.length];
  if(n){e.preventDefault();selectTab(n,true)}
 });
});

/* reviews slider */
var track=one(".slides");
if(track){
 var slides=q(".review",track),dots=one(".dots"),timer=null,paused=false;
 slides.forEach(function(s,i){
  var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Review "+(i+1));
  b.addEventListener("click",function(){go(i)});dots.appendChild(b);
 });
 var dbs=q("button",dots);
 function idx(){var w=slides[0].getBoundingClientRect().width+22;return Math.round(track.scrollLeft/w)}
 function perView(){return Math.max(1,Math.round(track.clientWidth/(slides[0].getBoundingClientRect().width+22)))}
 function go(i){var last=slides.length-perView();if(i>last)i=0;if(i<0)i=last;track.scrollTo({left:slides[i].offsetLeft-slides[0].offsetLeft,behavior:reduce?"auto":"smooth"})}
 function paint(){var c=idx();dbs.forEach(function(b,i){b.setAttribute("aria-current",String(i===c))})}
 track.addEventListener("scroll",function(){window.requestAnimationFrame(paint)},{passive:true});
 one("[data-prev]").addEventListener("click",function(){go(idx()-1)});
 one("[data-next]").addEventListener("click",function(){go(idx()+1)});
 var sl=one(".slider");
 ["mouseenter","focusin","touchstart"].forEach(function(ev){sl.addEventListener(ev,function(){paused=true},{passive:true})});
 ["mouseleave","focusout"].forEach(function(ev){sl.addEventListener(ev,function(){paused=false})});
 if(!reduce)timer=setInterval(function(){if(!paused&&!document.hidden)go(idx()+1)},5000);
 paint();
}

/* appointment form → WhatsApp message */
var form=one("#book-form");
if(form){
 var date=one("#f-date",form),d0=new Date();
 date.min=d0.getFullYear()+"-"+String(d0.getMonth()+1).padStart(2,"0")+"-"+String(d0.getDate()).padStart(2,"0");
 form.addEventListener("submit",function(e){
  e.preventDefault();
  var ok=true;
  function check(id,test,mr,en){var f=one(id,form),box=f.closest(".field"),er=one(".err",box);var good=test(f.value.trim());box.classList.toggle("bad",!good);er.innerHTML=good?"":bi(mr,en);if(!good&&ok){f.focus();ok=false}}
  check("#f-name",function(v){return v.length>1},"कृपया नाव लिहा.","Please enter your name.");
  check("#f-phone",function(v){return /^[6-9]\d{9}$/.test(v.replace(/[\s+-]/g,"").replace(/^91(?=\d{10}$)/,""))},"१० अंकी मोबाईल नंबर लिहा.","Enter a 10-digit mobile number.");
  check("#f-treat",function(v){return v!==""},"उपचार निवडा.","Choose a treatment.");
  check("#f-date",function(v){return v!==""&&v>=date.min&&(new Date(v+"T00:00").getDay()!==0)},"रविवार सोडून आजची किंवा पुढची तारीख निवडा.","Pick today or a later date, except Sunday.");
  if(!ok)return;
  var slot=one("input[name=slot]:checked",form);
  var tsel=one("#f-treat",form),topt=tsel.options[tsel.selectedIndex];
  var lines=[
   "नमस्कार, मला अपॉइंटमेंट हवी आहे. / Hello, I would like an appointment.",
   "नाव / Name: "+one("#f-name",form).value.trim(),
   "मोबाईल / Mobile: "+one("#f-phone",form).value.trim(),
   "उपचार / Treatment: "+topt.text,
   "तारीख / Date: "+new Date(date.value+"T00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"}),
   "वेळ / Time: "+(slot?slot.value:"Any")
  ];
  var note=one("#f-note",form).value.trim();if(note)lines.push("टीप / Note: "+note);
  var msg=lines.join("\n");
  var out=one("#sent",form);
  out.hidden=false;
  out.innerHTML='<b>'+bi("तुमचा मेसेज तयार आहे. WhatsApp वर पाठवण्यासाठी बटण दाबा.","Your message is ready. Tap the button to send it on WhatsApp.")+'</b><pre>'+esc(msg)+'</pre>'+
   '<a class="btn btn-wa" target="_blank" rel="noopener" href="'+esc(wa(msg))+'">'+bi("WhatsApp वर पाठवा","Send on WhatsApp")+'</a>';
  out.scrollIntoView({behavior:reduce?"auto":"smooth",block:"nearest"});
 });
}

/* map: live embed on the published site, link card inside previews */
var mq=encodeURIComponent(CONFIG.mapQuery);
q("[data-maplink]").forEach(function(a){a.href="https://www.google.com/maps/search/?api=1&query="+mq;a.target="_blank";a.rel="noopener"});
var map=one("#map"),topLevel=true;try{topLevel=window.self===window.top}catch(e){topLevel=false}
if(map&&topLevel){map.innerHTML='<iframe title="Clinic location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q='+mq+'&z=16&output=embed"></iframe>';map.classList.add("live")}
})();
