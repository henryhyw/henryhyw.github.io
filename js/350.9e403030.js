"use strict";(self["webpackChunkpersonalpage"]=self["webpackChunkpersonalpage"]||[]).push([[350],{7969:function(e,t,n){n.r(t),n.d(t,{initScript:function(){return o}});n(4114);function o(){function e(){console.log("DOM fully loaded and parsed");let e,t=[],n=!1,o=0,l=!1;const i=360,s=.2;let c,a=!0;const r=[{src:"/assets/vid/home1.mp4",class:"homevideo1",description:"Sunbathing, beers, and ocean breezes on the Mediterranean!"},{src:"/assets/vid/home2.mp4",class:"homevideo2",description:"Ducks enjoying a swim by the oceanside, weaving between the boats."},{src:"/assets/vid/home3.mp4",class:"homevideo3",description:"A cat strolling on the ancient stone steps, shot in Athens."}];let d=[...r],m=r[0];function u(){const e=navigator.userAgent||navigator.vendor||window.opera;return/android|iPhone|iPod/i.test(e)}function y(){const e=navigator.userAgent||navigator.vendor||window.opera;return/android|iPhone|iPad|iPod/i.test(e)}function p(){const e=Math.floor(Math.random()*d.length),t=d.splice(e,1)[0];m=t;const n=document.getElementById("videoElement"),o=n.querySelector("source");o.setAttribute("src",t.src),n.setAttribute("class",t.class),n.load();const l=document.getElementById("descriptionContent");l.innerHTML=`${t.description}<br><p>Click for color and sound!</p>`}function h(){r.forEach((e=>{const t=document.createElement("video");t.src=e.src,t.preload="auto",t.autoplay=!0,t.loop=!0,t.muted=!0,t.style.display="none",document.body.appendChild(t)}))}function f(){const e=document.getElementById("welcomeSubtitle"),t=window.matchMedia("(max-width: 768px)").matches;e.textContent=t?"Hello! I'm Han-yu, a junior at HKU, majoring in AI. I love to explore new places and code apps. I'm ready to share my journey with you!":"Hello! I'm Han-yu (Henry), a junior at HKU, majoring in Applied AI. I love to explore new places and code apps. I'm excited to have you here and share my journey with you!"}function g(e,t){const n=g.canvas||(g.canvas=document.createElement("canvas")),o=n.getContext("2d");o.font=t;const l=o.measureText(e);return l.width}function E(e,t){return window.getComputedStyle(e,null).getPropertyValue(t)}function v(e){const t=E(e,"font-weight")||"normal",n=E(e,"font-size")||"16px",o=E(e,"font-family")||"Times New Roman";return`${t} ${n} ${o}`}function I(){const e=document.getElementById("videoElement"),t=document.getElementById("imageElement"),n=document.getElementById("welcomeTitle"),o=(document.getElementById("welcomeSubtitle"),document.getElementById("compassIcon")),l="none"!==e.style.display?e:t,i=(l.clientHeight,document.querySelector(".welcome-text").clientWidth);let s=1;n.style.fontSize=`${s}em`;let c=.3;o.style.fontSize=s*c+"em";let a=g(n.textContent.replace("O",""),v(n))+o.clientWidth;while(a<i&&s<5)s+=.1,n.style.fontSize=`${s}em`,o.style.fontSize=s*c+"em",a=g(n.textContent.replace("O",""),v(n))+o.clientWidth;while(a>i&&s>.5)s-=.1,n.style.fontSize=`${s}em`,o.style.fontSize=s*c+"em",a=g(n.textContent.replace("O",""),v(n))+o.clientWidth}function w(){const e=document.getElementById("videoElement"),t=document.getElementById("imageElement"),n=document.getElementById("welcomeTitle"),o=document.getElementById("welcomeSubtitle"),l=(document.getElementById("compassIcon"),"none"!==e.style.display?e:t),i=l.clientHeight;document.querySelector(".welcome-text").clientWidth;let s=1;o.style.fontSize=`${s}em`;let c=n.clientHeight+o.clientHeight;while(c<i&&s<3)s+=.01,o.style.fontSize=`${s}em`,c=n.clientHeight+o.clientHeight;while(c>i&&s>.5)s-=.01,o.style.fontSize=`${s}em`,c=n.clientHeight+o.clientHeight;let a=1.4;o.style.lineHeight=a,c=n.clientHeight+o.clientHeight;while(c<i&&a<2)a+=.1,o.style.lineHeight=a,c=n.clientHeight+o.clientHeight;while(c>i&&a>1)a-=.1,o.style.lineHeight=a,c=n.clientHeight+o.clientHeight}function L(){f(),I();const e=window.matchMedia("(max-width: 600px)").matches;e&&(document.getElementById("welcomeTitle").style.fontSize="2em",document.getElementById("compassIcon").style.fontSize="1.1em"),w()}function B(e,t,n=100,o){c&&clearTimeout(c),t.innerHTML="";let l=0;const i=[];for(let c=0;c<e.length;c++){const n=document.createElement("span");n.className="typed",n.style.color="transparent",n.textContent=e[c],t.appendChild(n),i.push(n)}function s(){if(l<i.length){const e=document.body.classList.contains("dark-mode"),t=e?"#fafafa":"#252525";i[l].style.transition="color 2s",i[l].style.color=t,l++,c=setTimeout(s,n)}else o&&o()}s()}function S(){let e=!1;const t=document.getElementById("transitionOverlay");t.style.transition="opacity 0.3s ease-in-out",C.addEventListener("timeupdate",(()=>{const n=C.duration-C.currentTime;n<.6&&!e&&(t.style.opacity="1",e=!0)})),C.addEventListener("timeupdate",(()=>{C.currentTime>.2&&C.currentTime<1.2&&(t.style.opacity="0",e=!1)}))}function H(){if(0===t.length||n)return;n=!0;const{newAngle:e,newDuration:o}=t.shift(),l=document.getElementById("compassIcon");l.style.setProperty("--shake-angle",`${e}deg`),l.style.setProperty("--shake-duration",`${o}s`),l.classList.add("shake"),setTimeout((()=>{l.classList.remove("shake"),n=!1,H()}),1e3*o)}function T(){const e=document.getElementById("videoElement"),t=document.getElementById("transitionOverlay"),n=document.getElementById("descriptionOverlay"),o=e.querySelector("source");o.getAttribute("src");0===d.length&&(d=[...r]);const l=Math.floor(Math.random()*d.length),i=d.splice(l,1)[0];m=i,u()||(n.style.opacity=.5),e.classList.remove("flip2"),e.classList.add("flip"),t.classList.remove("flip2"),t.classList.add("flip"),n.classList.remove("flip2"),n.classList.add("flip"),e.addEventListener("animationend",(()=>{if(e.pause(),e.querySelector("source").src=i.src,e.load(),e.classList.remove("flip"),t.classList.remove("flip"),n.classList.remove("flip"),e.play(),e.muted){const e=document.getElementById("descriptionContent");e.innerHTML=`${m.description}<br><p>Click for color and sound!</p>`}else{const e=document.getElementById("descriptionContent");e.innerHTML=`${m.description}<br><p>Click to silence and fade!</p>`}e.classList.add("flip2"),t.classList.add("flip2"),n.classList.add("flip2"),e.addEventListener("animationend",(()=>{e.classList.remove("flip2"),t.classList.remove("flip2"),n.classList.remove("flip2"),e.setAttribute("class",i.class),n.style.opacity=""}),{once:!0})}),{once:!0})}function b(){const e=document.getElementById("compassIcon");function t(){e.classList.add("tipcolor-1"),setTimeout((function(){e.classList.remove("tipcolor-1")}),800)}e.style.transition="color 1.5s";const n=setInterval((function(){l?clearInterval(n):t()}),2400)}function A(){const e=document.getElementById("welcomeTitle");e.style.transition="color 2s",e.style.color="";const t=document.getElementById("welcomeSubtitle").textContent,n=document.getElementById("welcomeSubtitle");n.style.textAlign="justify",n.style.textAlignLast="justify",n.style.MozTextAlignLast="justify",B(t,n,10,(()=>{setTimeout((()=>{document.querySelectorAll("header *").forEach((e=>{e.style.transition="color 2s",e.style.color=""})),document.querySelectorAll("footer *").forEach((e=>{e.style.transition="color 2s",e.style.color=""}));const e=document.getElementById("welcomeQuote");e.style.transition="color 2s",e.style.color="";const t=document.getElementById("overlay");t.style.pointerEvents="none",setTimeout((()=>{b(),setTimeout((()=>{document.querySelectorAll("header *").forEach((e=>{e.style.transition="color 0.5s"})),document.querySelectorAll("footer *").forEach((e=>{e.style.transition="color 0.5s"}))}),2e3)}),1e3)}),1e3)}))}function x(){const e=document.getElementById("videoElement"),t=document.querySelector(".description-overlay");y()||(e.addEventListener("mouseenter",(()=>{t.style.opacity="0.5"})),e.addEventListener("mouseleave",(()=>{t.style.opacity="0"})))}if(document.getElementById("compassIcon").addEventListener("click",(function(){a&&T(),l=!0;const n=document.getElementById("compassIcon");n.classList.remove("tipcolor-1"),n.classList.remove("tipcolor-2"),o++;let c=Math.min(15+6*o,i),r=Math.max(.8-.06*o,s);t.push({newAngle:c,newDuration:r}),H(),clearTimeout(e),e=setTimeout((()=>{o=0}),500)})),"#/home"!==window.location.hash){const e=document.getElementById("overlay");e.style.pointerEvents="none"}p();const C=document.getElementById("videoElement"),M=document.getElementById("imageElement");function k(){let e=!1;const t=setTimeout((()=>{e||n(new Error("Timeout waiting for video to load"))}),3e3);function n(e){console.error("Error:",e),a=!1,C.style.display="none",M.style.display="block",M.style.opacity="1";const t=setInterval((function(){if(imageElement.naturalWidth>0&&imageElement.naturalHeight>0){const e=imageElement.naturalWidth/imageElement.naturalHeight;Math.abs(e-9/16)<.01&&(clearInterval(t),L(),setTimeout((()=>{A()}),1e3))}}),100)}C.addEventListener("loadeddata",(()=>{e=!0,clearTimeout(t),C.play().then((()=>{const e=setInterval((function(){if(C.videoWidth>0&&C.videoHeight>0){const t=C.videoWidth/C.videoHeight;Math.abs(t-9/16)<.01&&(clearInterval(e),x(),L(),C.addEventListener("click",(()=>{if(C.muted){C.muted=!1,C.style.filter="grayscale(0%)";const e=document.getElementById("descriptionContent");e.innerHTML=`${m.description}<br><p>Click to silence and fade!</p>`}else{C.muted=!0,C.style.filter="grayscale(85%)";const e=document.getElementById("descriptionContent");e.innerHTML=`${m.description}<br><p>Click for color and sound!</p>`}})),h(),S(),setTimeout((()=>{A()}),1e3))}}),100)})).catch((e=>{n(e)}))}),{once:!0});try{C.load()}catch(o){n(o)}}C.style.opacity="1",k(),window.onresize=()=>{c&&clearTimeout(c),console.log("resize"),L();const e=document.body.classList.contains("dark-mode"),t=document.getElementById("welcomeSubtitle"),n=e?"#fafafa":"#252525";t.style.transition="color 0s",t.style.color=n,t.style.transition="",t.style.textAlign="justify",t.style.textAlignLast="justify",t.style.MozTextAlignLast="justify",document.querySelectorAll("header *").forEach((e=>{e.style.transition="color 2s",e.style.color=""})),document.querySelectorAll("footer *").forEach((e=>{e.style.transition="color 2s",e.style.color=""}));const o=document.getElementById("welcomeQuote");o.style.transition="color 2s",o.style.color="";const l=document.getElementById("overlay");l.style.pointerEvents="none"}}"#/home"===window.location.hash&&(document.querySelectorAll("header *").forEach((e=>{e.style.color=""})),document.querySelectorAll("footer *").forEach((e=>{e.style.color=""}))),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",e):e()}}}]);
//# sourceMappingURL=350.9e403030.js.map