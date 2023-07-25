// ==UserScript==
// @name         Luogu Extend Feed
// @namespace    blog.heyc.eu.org
// @version      0.1.1
// @description  Extend feed in Luogu
// @author       Heyc
// @match        https://www.luogu.com.cn/*
// @connect      api-lgf.imken.moe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(()=>{var h="color: #5EB95E;";function i(t,...e){console.log(`%c[lgef] ${t}`,h,...e)}function w(t){let e={};i("Find cache",t);let n=new Date,a=new Date,c=new Date().getTime();return n.setTime(parseInt(GM_getValue(`cache/time_${t}`,"0"),10)),a.setTime(parseInt(GM_getValue("cache/expired","0"),10)),n===0?(i("Cache miss"),e.status="miss"):c-n>3e5||n<a?(i("Cache expired"),e.status="expired"):(i("Cache hit"),e.status="hit",e.content=GM_getValue(`cache/content_${t}`)),e}function I(t,e){i("Set cache",t,"=>",e),GM_setValue(`cache/content_${t}`,e),GM_setValue(`cache/time_${t}`,new Date().getTime().toString())}function u(){i("Clear cache"),GM_setValue("cache/expired",new Date().getTime().toString())}function d(t,e,...n){let a=w(t);a.status==="hit"?e(JSON.parse(a.content),...n):(i("Request",t),GM_xmlhttpRequest({method:"GET",url:t,onload(c){i("Request",`success: HTTP ${c.status}, Content: `,c.responseText);let o={error:!1,status:c.status,content:c.responseText};c.status===200&&I(t,JSON.stringify(o)),e(o,...n)},onerror(){i("Request","failed")}}))}var E={dragon:"/rank/dragon",dragond:"/rank/dailyDragon",bell:"/rank/bePinged",at:"/rank/pingOthers"};function f(t,e,n,...a){i("Get API",t);let c=`https://api-lgf.imken.moe${E[t]}`;for(let o in e)c=c.replaceAll(`{${o}}`,e[o]);d(c,n,...a)}var r=[["","",""],["dragon","\u7287\u728730d\u9F99\u738B\u699C","\u6761"],["dragond","\u7287\u728724h\u9F99\u738B\u699C","\u6761"],["bell","\u7287\u728730d\u94C3\u94DB\u699C","\u4E2A"],["at","\u7287\u728730d\u827E\u7279\u699C","\u6B21"]];function b(t,e,n){let a='<div data-v-8b7f80ba=""><span data-v-8b7f80ba=""><span data-v-36d4a8df="" data-v-8b7f80ba="">%NAME%</span></span><span data-v-8b7f80ba=""><span data-v-36d4a8df="" data-v-8b7f80ba="" class="info-content">%INFO%</span></span></div>';i("Add row",r[n][0]);let c=0;for(let o=0;o<e.content.length;o++)if(`${e.content[o].uid}`==`${_feInstance.currentData.user.uid}`){c=o+1;break}t.innerHTML+=a.replace(/%NAME%/g,r[n][1]).replace(/%INFO%/g,c!==0?`#${c} (${e.content[c-1].count} ${r[n][2]})`:"\u672A\u4E0A\u699C")}function m(t={},e=0){let n=document.querySelectorAll(".info-rows")[0];n===void 0||n.lgef!==void 0&&n.lgef>=e||e<r.length&&(n.lgef=e,e>0&&b(n,JSON.parse(t.content),e),e<r.length-1&&f(r[e+1][0],{},m,e+1))}var l={status:!1,content:[]},g=1;function v(){let t=document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right")[0];if(t.lastChild.id!=="lgef-flwing-rank"){let e=document.createElement("div");e.className="lg-article",e.id="lgef-flwing-rank",e.innerHTML=`
        <h2>\u300C\u6211\u5173\u6CE8\u7684\u300D\u7287\u7287\u6392\u884C</h2>
        <p>
            \u9009\u62E9\u6392\u884C\u699C
            <select id="lgef-flwing-rank-type">
                <option disabled="disabled">\u8BF7\u9009\u62E9</option>
                <option value="dragon" selected>30d\u9F99\u738B\u699C</option>
                <option value="dragond">24h\u9F99\u738B\u699C</option>
                <option value="bell">30d\u94C3\u94DB\u699C</option>
                <option value="at">30d\u827E\u7279\u699C</option>
            </select>
        </p>
        <div id="lgef-flwing-rank-show">
            <center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>
        </div>
        <p><button id="lgef-clear-cache" class="am-btn am-btn-primary am-btn-sm">\u6E05\u9664\u7F13\u5B58</button></p>
        `,t.appendChild(e),document.getElementById("lgef-flwing-rank-type").addEventListener("change",()=>{g=document.getElementById("lgef-flwing-rank-type").selectedIndex,document.getElementById("lgef-flwing-rank-show").innerHTML='<center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>',s()}),document.getElementById("lgef-clear-cache").addEventListener("click",()=>{u(),l.status=!1,l.content=[],document.getElementById("lgef-flwing-rank-show").innerHTML='<center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>',s()})}}function p(t={},e=0){let n=Math.ceil(_feInstance.currentUser.followingCount/20);document.getElementById("lgef-flwing-rank-status").innerHTML=`\u83B7\u53D6\u5173\u6CE8\u5217\u8868... (${e+1}/${n})`,e>0&&(l.content=l.content.concat(JSON.parse(t.content).users.result)),e<n&&d(`/api/user/followings?user=${_feInstance.currentUser.uid}&page=${e+1}`,p,e+1),e===n&&(l.content.push(_feInstance.currentUser),l.status=!0,s({},1))}function k(t){let e=`
    <div style="width: 100%; display: flex; margin-bottom: 1em;">
    <span style="color: #c8c8c8;">
        #%RANK%
    </span>
    <span style="height: 1em; margin-left: .3em;">
        <img src="//cdn.luogu.com.cn/upload/usericon/%UID%.png" style="height: 1.5em; border-radius: .75em;">
        <a href="/user/%UID%" class="lg-fg-%COLOR% lg-bold" target="_blank">
            %NAME%
        </a>
    </span>
    <span style="margin-left: auto;">
        %VALUE% %UNIT%
    </span>
    </div>`,n="";for(let a=0;a<t.length;a++)n+=e.replace(/%RANK%/g,a+1).replace(/%UID%/g,t[a][1].uid).replace(/%COLOR%/g,t[a][1].color.toLowerCase()).replace(/%NAME%/g,t[a][1].name).replace(/%VALUE%/g,t[a][2]).replace(/%UNIT%/g,r[g][2]);n===""&&(n="<p><center>\u65E0\u4EBA\u4E0A\u699C\uFF0C\u4E89\u5F53\u7B2C\u4E00\uFF01</center></p>"),document.getElementById("lgef-flwing-rank-show").innerHTML=n}function s(t={},e=0){if(e===0&&(l.status?s({},1):p()),e===1&&(document.getElementById("lgef-flwing-rank-status").innerHTML="\u83B7\u53D6\u699C\u5355...",f(r[g][0],{},s,e+1)),e===2){t=JSON.parse(t.content);let n=[];for(let a=0;a<t.content.length;a++)for(let c=0;c<l.content.length;c++)`${t.content[a].uid}`==`${l.content[c].uid}`&&(n[n.length]=[a+1,l.content[c],t.content[a].count]);k(n)}}async function M(){v(),s()}function $(){i("Starting");let t=/^\/user\/[0-9]+/,e=/^\/$/;t.test(document.location.pathname)&&(i("User rank"),setInterval(m,1e3)),e.test(document.location.pathname)&&(i("Following rank"),M()),i("Started")}$();})();
