// ==UserScript==
// @name         Luogu Extend Feed
// @namespace    blog.heyc.eu.org
// @version      0.1.2
// @description  Extend feed in Luogu
// @author       Heyc
// @match        https://www.luogu.com.cn/*
// @connect      api-lgf.imken.moe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(()=>{var I="color: #5EB95E;";function d(t,...e){console.log(`%c[lgef] ${t}`,I,...e)}function w(t){let e={};d("Find cache",t);let n=new Date,l=new Date,i=new Date().getTime();return n.setTime(parseInt(GM_getValue(`cache/time_${t}`,"0"),10)),l.setTime(parseInt(GM_getValue("cache/expired","0"),10)),n===0?(d("Cache miss"),e.status="miss"):i-n>3e5||n<l?(d("Cache expired"),e.status="expired"):(d("Cache hit"),e.status="hit",e.content=GM_getValue(`cache/content_${t}`)),e}function v(t,e){d("Set cache",t,"=>",e),GM_setValue(`cache/content_${t}`,e),GM_setValue(`cache/time_${t}`,new Date().getTime().toString())}function b(){d("Clear cache"),GM_setValue("cache/expired",new Date().getTime().toString())}function m(t,e,...n){let l=w(t);l.status==="hit"?e(JSON.parse(l.content),...n):(d("Request",t),GM_xmlhttpRequest({method:"GET",url:t,onload(i){d("Request",`success: HTTP ${i.status}, Content: `,i.responseText);let o={error:!1,status:i.status,content:i.responseText};i.status===200&&v(t,JSON.stringify(o)),e(o,...n)},onerror(){d("Request","failed")}}))}var B={dragon:"/rank/dragon",dragond:"/rank/dailyDragon",bell:"/rank/bePinged",at:"/rank/pingOthers"};function h(t,e,n,...l){d("Get API",t);let i=`https://api-lgf.imken.moe${B[t]}`;for(let o in e)i=i.replaceAll(`{${o}}`,e[o]);m(i,n,...l)}var r=[["","",""],["dragon","\u7287\u728730d\u9F99\u738B\u699C","\u6761"],["dragond","\u7287\u728724h\u9F99\u738B\u699C","\u6761"],["bell","\u7287\u728730d\u94C3\u94DB\u699C","\u4E2A"],["at","\u7287\u728730d\u827E\u7279\u699C","\u6B21"]];function k(t,e,n){let l='<div data-v-8b7f80ba=""><span data-v-8b7f80ba=""><span data-v-36d4a8df="" data-v-8b7f80ba="">%NAME%</span></span><span data-v-8b7f80ba=""><span data-v-36d4a8df="" data-v-8b7f80ba="" class="info-content">%INFO%</span></span></div>';d("Add row",r[n][0]);let i=0;for(let o=0;o<e.content.length;o++)if(`${e.content[o].uid}`==`${_feInstance.currentData.user.uid}`){i=o+1;break}t.innerHTML+=l.replace(/%NAME%/g,r[n][1]).replace(/%INFO%/g,i!==0?`#${i} (${e.content[i-1].count} ${r[n][2]})`:"\u672A\u4E0A\u699C")}function y(t={},e=0){let n=document.querySelectorAll(".info-rows")[0];n===void 0||n.lgef!==void 0&&n.lgef>=e||e<r.length&&(n.lgef=e,e>0&&k(n,JSON.parse(t.content),e),e<r.length-1&&h(r[e+1][0],{},y,e+1))}var c={status:!1,content:[]},p=1;function M(){let t=document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right")[0];if(t.lastChild.id!=="lgef-flwing-rank"){let e=document.createElement("div");e.className="lg-article",e.id="lgef-flwing-rank",e.innerHTML=`
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
        `,t.appendChild(e),document.getElementById("lgef-flwing-rank-type").addEventListener("change",()=>{p=document.getElementById("lgef-flwing-rank-type").selectedIndex,document.getElementById("lgef-flwing-rank-show").innerHTML='<center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>',u()}),document.getElementById("lgef-clear-cache").addEventListener("click",()=>{b(),c.status=!1,c.content=[],document.getElementById("lgef-flwing-rank-show").innerHTML='<center><span id="lgef-flwing-rank-status">\u52A0\u8F7D\u4E2D...</span></center>',u()})}}function E(t={},e=0){let n=Math.ceil(_feInstance.currentUser.followingCount/20);document.getElementById("lgef-flwing-rank-status").innerHTML=`\u83B7\u53D6\u5173\u6CE8\u5217\u8868... (${e+1}/${n})`,e>0&&(c.content=c.content.concat(JSON.parse(t.content).users.result)),e<n&&m(`/api/user/followings?user=${_feInstance.currentUser.uid}&page=${e+1}`,E,e+1),e===n&&(c.content.push(_feInstance.currentUser),c.status=!0,u({},1))}function L(t){let e=`
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
    </div>`,n="";for(let l=0;l<t.length;l++)n+=e.replace(/%RANK%/g,l+1).replace(/%UID%/g,t[l][1].uid).replace(/%COLOR%/g,t[l][1].color.toLowerCase()).replace(/%NAME%/g,t[l][1].name).replace(/%VALUE%/g,t[l][2]).replace(/%UNIT%/g,r[p][2]);n===""&&(n="<p><center>\u65E0\u4EBA\u4E0A\u699C\uFF0C\u4E89\u5F53\u7B2C\u4E00\uFF01</center></p>"),document.getElementById("lgef-flwing-rank-show").innerHTML=n}function u(t={},e=0){if(e===0&&(c.status?u({},1):E()),e===1&&(document.getElementById("lgef-flwing-rank-status").innerHTML="\u83B7\u53D6\u699C\u5355...",h(r[p][0],{},u,e+1)),e===2){t=JSON.parse(t.content);let n=[];for(let l=0;l<t.content.length;l++)for(let i=0;i<c.content.length;i++)`${t.content[l].uid}`==`${c.content[i].uid}`&&(n[n.length]=[l+1,c.content[i],t.content[l].count]);L(n)}}var a=[],s=-1;function N(){let t=GM_getValue("shield_rules","[]");a=JSON.parse(t)}function T(t){s=t,document.getElementById("lgef-shield-rule-edit-desc").value=a[t][0],document.getElementById("lgef-shield-rule-edit-mode").selectedIndex=a[t][1],document.getElementById("lgef-shield-rule-edit-cont").value=a[t][2]}function f(){s!==-1&&(a[s]=[document.getElementById("lgef-shield-rule-edit-desc").value,document.getElementById("lgef-shield-rule-edit-mode").selectedIndex,document.getElementById("lgef-shield-rule-edit-cont").value],s=-1),GM_setValue("shield_rules",JSON.stringify(a))}function $(t){a.splice(s,1),s=-1}function x(){document.getElementById("lgef-shield-rule-edit-desc").value="",document.getElementById("lgef-shield-rule-edit-mode").selectedIndex=0,document.getElementById("lgef-shield-rule-edit-cont").value="",s=a.length}function g(){let t='<tr><td>%ID%</td><td>%DESC%</td><td><button id="lgef-shield-rule-edit-%ID%" class="am-btn am-btn-primary am-btn-sm">\u7F16\u8F91</button><br><button id="lgef-shield-rule-delete-%ID%" class="am-btn am-btn-danger am-btn-sm">\u5220\u9664</button></td></tr>',e="";for(let n=0;n<a.length;n++)e+=t.replace(/%ID%/g,n+1).replace(/%DESC%/g,a[n][0]);document.getElementById("lgef-shield-rules-show-body").innerHTML=e;for(let n=0;n<a.length;n++)document.getElementById(`lgef-shield-rule-edit-${n+1}`).addEventListener("click",()=>{T(n),document.getElementById("lgef-shield-rule-edit").style.display="block"}),document.getElementById(`lgef-shield-rule-delete-${n+1}`).addEventListener("click",()=>{s!==-1&&(f(),document.getElementById("lgef-shield-rule-edit").style.display="none"),$(n),f(),g()});d("rule",a,s)}function _(){let t=document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right")[0];if(t.lastChild.id!=="lgef-shield"){let e=document.createElement("div");e.className="lg-article",e.id="lgef-shield",e.innerHTML=`
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
        `,t.appendChild(e),N(),g(),document.getElementById("lgef-shield-rule-btn-save").addEventListener("click",()=>{s!==-1&&(f(),document.getElementById("lgef-shield-rule-edit").style.display="none",g())}),document.getElementById("lgef-shield-rule-btn-cancel").addEventListener("click",()=>{s!==-1&&(s=-1,document.getElementById("lgef-shield-rule-edit").style.display="none",g())}),document.getElementById("lgef-shield-rule-btn-new").addEventListener("click",()=>{s!==-1&&f(),x(),document.getElementById("lgef-shield-rule-edit").style.display="block"})}}function S(){document.querySelectorAll(".am-comment-bd").forEach(t=>{a.forEach(e=>{e[1]===0&&t.innerText.indexOf(e[2])!==-1&&t.parentNode.parentNode.remove(),e[1]===1&&new RegExp(e[2]).test(t.innerText)&&t.parentNode.parentNode.remove()})})}function D(){let t=document.getElementById("feed");new MutationObserver(()=>{S()}).observe(t,{childList:!0,subtree:!0})}function O(){d("Starting");let t=/^\/user\/[0-9]+/,e=/^\/$/,n=/^\/$/;t.test(document.location.pathname)&&(d("User rank"),setInterval(y,1e3)),e.test(document.location.pathname)&&(d("Following rank"),M(),async function(){u()}()),n.test(document.location.pathname)&&(d("Feed shield"),_(),async function(){D()}()),d("Started")}O();})();
