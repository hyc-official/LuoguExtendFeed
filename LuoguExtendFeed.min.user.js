// ==UserScript==
// @name         Luogu Extend Feed
// @namespace    blog.heyc.eu.org
// @version      0.2.0
// @description  Extend feed in Luogu
// @author       Heyc
// @match        https://www.luogu.com.cn/*
// @connect      api-lgf.imken.moe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(()=>{var v="color: #5EB95E;";function d(e,...t){console.log(`%c[lgef] ${e}`,v,...t)}function k(e){let t={};d("Find cache",e);let n=new Date,l=new Date,i=new Date().getTime();return n.setTime(parseInt(GM_getValue(`cache/time_${e}`,"0"),10)),l.setTime(parseInt(GM_getValue("cache/expired","0"),10)),n===0?(d("Cache miss"),t.status="miss"):i-n>3e5||n<l?(d("Cache expired"),t.status="expired"):(d("Cache hit"),t.status="hit",t.content=GM_getValue(`cache/content_${e}`)),t}function B(e,t){d("Set cache",e),GM_setValue(`cache/content_${e}`,t),GM_setValue(`cache/time_${e}`,new Date().getTime().toString())}function E(){d("Clear cache"),GM_setValue("cache/expired",new Date().getTime().toString())}function p(e,t,...n){let l=k(e);l.status==="hit"?t(JSON.parse(l.content),...n):(d("Request",e),GM_xmlhttpRequest({method:"GET",url:e,onload(i){d("Request",`success: HTTP ${i.status}`);let r={error:!1,status:i.status,content:i.responseText};i.status===200&&B(e,JSON.stringify(r)),t(r,...n)},onerror(){d("Request","failed")}}))}var M={dragon:"/rank/dragon",dragond:"/rank/dailyDragon",bell:"/rank/bePinged",at:"/rank/pingOthers"};function b(e,t,n,...l){d("Get API",e);let i=`https://api-lgf.imken.moe${M[e]}`;for(let r in t)i=i.replaceAll(`{${r}}`,t[r]);p(i,n,...l)}var c=[["","",""],["dragon","\u6708\u9F99\u738B\u699C","\u6761"],["dragond","\u65E5\u9F99\u738B\u699C","\u6761"],["bell","\u6708\u94C3\u94DB\u699C","\u4E2A"],["at","\u6708\u827E\u7279\u699C","\u6B21"]],f=0;function L(e,t,n,l){let i='<div data-v-bd496524="" class="field lgef-userrank-row"><div data-v-bd496524=""><span data-v-bd496524="" class="key">%NAME%</span> <span data-v-bd496524="" class="value">%INFO%</span></div></div>';d("Add row",c[l][0]);let r=0;for(let g=0;g<n.content.length;g++)if(`${n.content[g].uid}`==`${_feInstance.currentData.user.uid}`){r=g+1;break}t.innerHTML+=i.replace(/%NAME%/g,c[l][1]).replace(/%INFO%/g,r!==0?`#${r} (${n.content[r-1].count} ${c[l][2]})`:"\u672A\u4E0A\u699C")}function I(e,t={},n=0){let l=document.querySelectorAll("div.user-stat-data.lfe-caption > div.stats.normal")[0];l===void 0||e!==f||n<c.length&&(n>0&&L(e,l,JSON.parse(t.content),n),n<c.length-1&&b(c[n+1][0],{},i=>{I(e,i,n+1)}))}var o={status:!1,content:[]},y=1;function N(){let e=document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right")[0];if(e.lastChild.id!=="lgef-flwing-rank"){let t=document.createElement("div");t.className="lg-article",t.id="lgef-flwing-rank",t.innerHTML=`
        <h2>\u300C\u6211\u5173\u6CE8\u7684\u300D\u7287\u7287\u6392\u884C</h2>
        <p>
            \u9009\u62E9\u6392\u884C\u699C
            <select id="lgef-flwing-rank-type">
                <option disabled="disabled">\u8BF7\u9009\u62E9</option>
                <option value="dragon" selected>\u6708\u9F99\u738B\u699C</option>
                <option value="dragond">\u65E5\u9F99\u738B\u699C</option>
                <option value="bell">\u6708\u94C3\u94DB\u699C</option>
                <option value="at">\u6708\u827E\u7279\u699C</option>
            </select>
        </p>
        <div id="lgef-flwing-rank-show">
            <center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>
        </div>
        <p><button id="lgef-clear-cache" class="am-btn am-btn-primary am-btn-sm">\u6E05\u9664\u7F13\u5B58</button></p>
        `,e.appendChild(t),document.getElementById("lgef-flwing-rank-type").addEventListener("change",()=>{y=document.getElementById("lgef-flwing-rank-type").selectedIndex,document.getElementById("lgef-flwing-rank-show").innerHTML='<center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>',u()}),document.getElementById("lgef-clear-cache").addEventListener("click",()=>{E(),o.status=!1,o.content=[],document.getElementById("lgef-flwing-rank-show").innerHTML='<center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>',u()})}}function w(e={},t=0){let n=Math.ceil(_feInstance.currentUser.followingCount/20);document.getElementById("lgef-flwing-rank-status").innerHTML=`\u83B7\u53D6\u5173\u6CE8\u5217\u8868... (${t+1}/${n})`,t>0&&(o.content=o.content.concat(JSON.parse(e.content).users.result)),t<n&&p(`/api/user/followings?user=${_feInstance.currentUser.uid}&page=${t+1}`,w,t+1),t===n&&(o.content.push(_feInstance.currentUser),o.status=!0,u({},1))}function _(e){let t={Cheater:"brown",Gray:"none",Blue:"bluelight",Green:"green",Orange:"orange",Red:"red",Purple:"purple"},n=`
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
    </div>`,l="";for(let i=0;i<e.length;i++)l+=n.replace(/%RANK%/g,i+1).replace(/%UID%/g,e[i][1].uid).replace(/%COLOR%/g,t[e[i][1].color]).replace(/%NAME%/g,e[i][1].name).replace(/%VALUE%/g,e[i][2]).replace(/%UNIT%/g,c[y][2]);l===""&&(l="<p><center>\u65E0\u4EBA\u4E0A\u699C\uFF0C\u4E89\u5F53\u7B2C\u4E00\uFF01</center></p>"),document.getElementById("lgef-flwing-rank-show").innerHTML=l}function u(e={},t=0){if(t===0&&(o.status?u({},1):w()),t===1&&(document.getElementById("lgef-flwing-rank-status").innerHTML="\u83B7\u53D6\u699C\u5355...",b(c[y][0],{},u,t+1)),t===2){e=JSON.parse(e.content);let n=[];for(let l=0;l<e.content.length;l++)for(let i=0;i<o.content.length;i++)`${e.content[l].uid}`==`${o.content[i].uid}`&&(n[n.length]=[l+1,o.content[i],e.content[l].count]);_(n)}}var a=[],s=-1;function $(){let e=GM_getValue("shield_rules","[]");a=JSON.parse(e)}function T(e){s=e,[document.getElementById("lgef-shield-rule-edit-desc").value,document.getElementById("lgef-shield-rule-edit-mode").selectedIndex,document.getElementById("lgef-shield-rule-edit-cont").value]=a[e]}function h(){s!==-1&&(a[s]=[document.getElementById("lgef-shield-rule-edit-desc").value,document.getElementById("lgef-shield-rule-edit-mode").selectedIndex,document.getElementById("lgef-shield-rule-edit-cont").value],s=-1),GM_setValue("shield_rules",JSON.stringify(a))}function x(e){a.splice(e,1)}function S(){document.getElementById("lgef-shield-rule-edit-desc").value="",document.getElementById("lgef-shield-rule-edit-mode").selectedIndex=0,document.getElementById("lgef-shield-rule-edit-cont").value="",s=a.length}function m(){let e='<tr><td>%ID%</td><td>%DESC%</td><td><button id="lgef-shield-rule-edit-%ID%" class="am-btn am-btn-primary am-btn-sm">\u7F16\u8F91</button><br><button id="lgef-shield-rule-delete-%ID%" class="am-btn am-btn-danger am-btn-sm">\u5220\u9664</button></td></tr>',t="";for(let n=0;n<a.length;n++)t+=e.replace(/%ID%/g,n+1).replace(/%DESC%/g,a[n][0]);document.getElementById("lgef-shield-rules-show-body").innerHTML=t;for(let n=0;n<a.length;n++)document.getElementById(`lgef-shield-rule-edit-${n+1}`).addEventListener("click",()=>{T(n),document.getElementById("lgef-shield-rule-edit").style.display="block"}),document.getElementById(`lgef-shield-rule-delete-${n+1}`).addEventListener("click",()=>{s!==-1&&(h(),document.getElementById("lgef-shield-rule-edit").style.display="none"),x(n),h(),m()});d("rule",a,s)}function D(){let e=document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right")[0];if(e.lastChild.id!=="lgef-shield"){let t=document.createElement("div");t.className="lg-article",t.id="lgef-shield",t.innerHTML=`
        <h2>\u7287\u7287\u5C4F\u853D\u5668</h2>
        <div id="lgef-shield-rule-edit" style="display: none;">
            <h3>\u7F16\u8F91\u5C4F\u853D\u89C4\u5219</h3>
            <p>
                \u63CF\u8FF0 <br> <input id="lgef-shield-rule-edit-desc" style="width: auto;"> <br>
                \u7C7B\u578B <br> <select id="lgef-shield-rule-edit-mode" style="width: auto;">
                    <option value="include" selected>\u5305\u542B\u5B57\u7B26\u4E32</option>
                    <option value="regex">\u6B63\u5219\u8868\u8FBE\u5F0F\u5339\u914D</option>
                </select> <br>
                \u5185\u5BB9 <br> <input id="lgef-shield-rule-edit-cont" style="width: auto;">
            </p>
            <p>
                <button id="lgef-shield-rule-btn-save" class="am-btn am-btn-primary am-btn-sm">\u4FDD\u5B58</button>
                <button id="lgef-shield-rule-btn-cancel" class="am-btn am-btn-danger am-btn-sm">\u53D6\u6D88</button>
            </p>
        </div>
        <div id="lgef-shield-rules-show">
            <h3>\u5C4F\u853D\u89C4\u5219\u5217\u8868</h3>
            <table>
                <thead style="text-align: center;">
                    <tr>
                        <th>\u7F16\u53F7</th>
                        <th>\u63CF\u8FF0</th>
                        <th>\u64CD\u4F5C</th>
                    </tr>
                </thead>
                <tbody id="lgef-shield-rules-show-body"></tbody>
            </table>
        </div>
        <button id="lgef-shield-rule-btn-new" class="am-btn am-btn-primary am-btn-sm">\u65B0\u5EFA\u89C4\u5219</button>
        `,e.appendChild(t),$(),m(),document.getElementById("lgef-shield-rule-btn-save").addEventListener("click",()=>{s!==-1&&(h(),document.getElementById("lgef-shield-rule-edit").style.display="none",m())}),document.getElementById("lgef-shield-rule-btn-cancel").addEventListener("click",()=>{s!==-1&&(s=-1,document.getElementById("lgef-shield-rule-edit").style.display="none",m())}),document.getElementById("lgef-shield-rule-btn-new").addEventListener("click",()=>{s!==-1&&h(),S(),document.getElementById("lgef-shield-rule-edit").style.display="block"})}}function O(){document.querySelectorAll(".am-comment-bd").forEach(e=>{a.forEach(t=>{t[1]===0&&e.innerText.indexOf(t[2])!==-1&&e.parentNode.parentNode.remove(),t[1]===1&&new RegExp(t[2]).test(e.innerText)&&e.parentNode.parentNode.remove()})})}function A(){let e=document.getElementById("feed");new MutationObserver(()=>{O()}).observe(e,{childList:!0,subtree:!0})}function G(){d("Starting");let e=/^\/user\/[0-9]+/,t=/^\/$/,n=/^\/$/;e.test(document.location.pathname)&&(d("User rank"),setInterval(()=>{f!==_feInstance.currentData.user.uid&&(d("(Re)Loading user rank"),document.querySelectorAll(".lgef-userrank-row").forEach(l=>{l.remove()}),f=_feInstance.currentData.user.uid,I(f))},1e3)),t.test(document.location.pathname)&&(d("Following rank"),N(),(async()=>u())()),n.test(document.location.pathname)&&(d("Feed shield"),D(),(async()=>A())()),d("Started")}G();})();
