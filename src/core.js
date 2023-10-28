import {
    LGEFlog, getapi, request, clrcache,
} from "./utils.js";

const rkname = [
    ["", "", ""],
    ["dragon", "月龙王榜", "条"],
    ["dragond", "日龙王榜", "条"],
    ["bell", "月铃铛榜", "个"],
    ["at", "月艾特榜", "次"],
];

// ------------------------------

/**
 *
 * @param row
 * @param cbk
 * @param stp
 */
function addrow(row, cbk, stp) {
    const rowhtml = "<div data-v-bd496524=\"\" class=\"field lgef-userrank-row\"><div data-v-bd496524=\"\"><span data-v-bd496524=\"\" class=\"key\">%NAME%</span> <span data-v-bd496524=\"\" class=\"value\">%INFO%</span></div></div>";
    LGEFlog("Add row", rkname[stp][0]);
    let rk = 0;
    for (let i = 0; i < cbk.content.length; i++) {
        if (`${cbk.content[i].uid}` === `${_feInstance.currentData.user.uid}`) {
            rk = i + 1;
            break;
        }
    }
    row.innerHTML += rowhtml.replace(/%NAME%/g, rkname[stp][1]).replace(/%INFO%/g, rk !== 0 ? `#${rk} (${cbk.content[rk - 1].count} ${rkname[stp][2]})` : "未上榜");
}

/**
 *
 * @param cbk
 * @param stp
 */
function userrank(cbk = {}, stp = 0) {
    const row = document.querySelectorAll("div.user-stat-data.lfe-caption > div.stats.normal")[0];
    if (row === undefined || (row.lgef !== undefined && row.lgef >= stp)) {
        return;
    }
    if (stp < rkname.length) {
        row.lgef = stp;
        if (stp > 0) {
            addrow(row, JSON.parse(cbk.content), stp);
        }
        if (stp < rkname.length - 1) {
            getapi(rkname[stp + 1][0], {}, userrank, stp + 1);
        }
    }
}

// ------------------------------

const flwing = {
    status: false,
    content: [],
};

let rankmode = 1;

/**
 *
 */
function initflwingrank() {
    const fth = document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right")[0];
    if (fth.lastChild.id !== "lgef-flwing-rank") {
        const blk = document.createElement("div");
        blk.className = "lg-article";
        blk.id = "lgef-flwing-rank";
        blk.innerHTML = `
        <h2>「我关注的」犇犇排行</h2>
        <p>
            选择排行榜
            <select id="lgef-flwing-rank-type">
                <option disabled="disabled">请选择</option>
                <option value="dragon" selected>月龙王榜</option>
                <option value="dragond">日龙王榜</option>
                <option value="bell">月铃铛榜</option>
                <option value="at">月艾特榜</option>
            </select>
        </p>
        <div id="lgef-flwing-rank-show">
            <center><span id="lgef-flwing-rank-status">加载中...</span></center>
        </div>
        <p><button id="lgef-clear-cache" class="am-btn am-btn-primary am-btn-sm">清除缓存</button></p>
        `;
        fth.appendChild(blk);
        document.getElementById("lgef-flwing-rank-type").addEventListener("change", () => {
            rankmode = document.getElementById("lgef-flwing-rank-type").selectedIndex;
            document.getElementById("lgef-flwing-rank-show").innerHTML = "<center><span id=\"lgef-flwing-rank-status\">加载中...</span></center>";
            // eslint-disable-next-line no-use-before-define
            flwingrank();
        });
        document.getElementById("lgef-clear-cache").addEventListener("click", () => {
            clrcache();
            flwing.status = false;
            flwing.content = [];
            document.getElementById("lgef-flwing-rank-show").innerHTML = "<center><span id=\"lgef-flwing-rank-status\">加载中...</span></center>";
            // eslint-disable-next-line no-use-before-define
            flwingrank();
        });
    }
}

/**
 *
 * @param cbk
 * @param pge
 */
function getflwing(cbk = {}, pge = 0) {
    const pges = Math.ceil(_feInstance.currentUser.followingCount / 20);
    document.getElementById("lgef-flwing-rank-status").innerHTML = `获取关注列表... (${pge + 1}/${pges})`;
    if (pge > 0) {
        flwing.content = flwing.content.concat(JSON.parse(cbk.content).users.result);
    }
    if (pge < pges) {
        request(`/api/user/followings?user=${_feInstance.currentUser.uid}&page=${pge + 1}`, getflwing, pge + 1);
    }
    if (pge === pges) {
        flwing.content.push(_feInstance.currentUser);
        flwing.status = true;
        // eslint-disable-next-line no-use-before-define
        flwingrank({}, 1);
    }
}

/**
 *
 * @param rnk
 */
function showflwingrank(rnk) {
    const color = {
        Cheater: "brown",
        Gray: "none",
        Blue: "bluelight",
        Green: "green",
        Orange: "orange",
        Red: "red",
        Purple: "purple",
    };
    const rowhtml = `
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
    </div>`;
    let rows = "";
    for (let i = 0; i < rnk.length; i++) {
        rows += rowhtml.replace(/%RANK%/g, i + 1).replace(/%UID%/g, rnk[i][1].uid).replace(/%COLOR%/g, color[rnk[i][1].color]).replace(/%NAME%/g, rnk[i][1].name)
            .replace(/%VALUE%/g, rnk[i][2])
            .replace(/%UNIT%/g, rkname[rankmode][2]);
    }
    if (rows === "") {
        rows = "<p><center>无人上榜，争当第一！</center></p>";
    }
    document.getElementById("lgef-flwing-rank-show").innerHTML = rows;
}

/**
 *
 * @param cbk
 * @param stp
 */
function flwingrank(cbk = {}, stp = 0) {
    if (stp === 0) {
        if (!flwing.status) {
            getflwing();
        } else {
            flwingrank({}, 1);
        }
    }
    if (stp === 1) {
        document.getElementById("lgef-flwing-rank-status").innerHTML = `获取榜单...`;
        getapi(rkname[rankmode][0], {}, flwingrank, stp + 1);
    }
    if (stp === 2) {
        cbk = JSON.parse(cbk.content);
        const rnk = [];
        for (let i = 0; i < cbk.content.length; i++) {
            for (let j = 0; j < flwing.content.length; j++) {
                if (`${cbk.content[i].uid}` === `${flwing.content[j].uid}`) {
                    rnk[rnk.length] = [i + 1, flwing.content[j], cbk.content[i].count];
                }
            }
        }
        showflwingrank(rnk);
    }
}

// ------------------------------

let rules = [];
let editing = -1;

/**
 *
 */
function readrules() {
    const val = GM_getValue("shield_rules", "[]");
    rules = JSON.parse(val);
}

/**
 *
 * @param id
 */
function editrule(id) {
    editing = id;
    [
        document.getElementById("lgef-shield-rule-edit-desc").value,
        document.getElementById("lgef-shield-rule-edit-mode").selectedIndex,
        document.getElementById("lgef-shield-rule-edit-cont").value,
    ] = rules[id];
}
/**
 *
 */
function saverule() {
    if (editing !== -1) {
        rules[editing] = [
            document.getElementById("lgef-shield-rule-edit-desc").value,
            document.getElementById("lgef-shield-rule-edit-mode").selectedIndex,
            document.getElementById("lgef-shield-rule-edit-cont").value,
        ];
        editing = -1;
    }
    GM_setValue("shield_rules", JSON.stringify(rules));
}
/**
 *
 * @param id
 */
function delrule(id) {
    rules.splice(id, 1);
}
/**
 *
 */
function newrule() {
    document.getElementById("lgef-shield-rule-edit-desc").value = "";
    document.getElementById("lgef-shield-rule-edit-mode").selectedIndex = 0;
    document.getElementById("lgef-shield-rule-edit-cont").value = "";
    editing = rules.length;
}
/**
 *
 */
function loadrule() {
    const rhtml = "<tr><td>%ID%</td><td>%DESC%</td><td><button id=\"lgef-shield-rule-edit-%ID%\" class=\"am-btn am-btn-primary am-btn-sm\">编辑</button><br><button id=\"lgef-shield-rule-delete-%ID%\" class=\"am-btn am-btn-danger am-btn-sm\">删除</button></td></tr>";
    let bhtml = "";
    for (let i = 0; i < rules.length; i++) {
        bhtml += rhtml.replace(/%ID%/g, i + 1).replace(/%DESC%/g, rules[i][0]);
    }
    document.getElementById("lgef-shield-rules-show-body").innerHTML = bhtml;
    for (let i = 0; i < rules.length; i++) {
        document.getElementById(`lgef-shield-rule-edit-${i + 1}`).addEventListener("click", () => {
            editrule(i);
            document.getElementById("lgef-shield-rule-edit").style.display = "block";
        });
        // eslint-disable-next-line no-loop-func
        document.getElementById(`lgef-shield-rule-delete-${i + 1}`).addEventListener("click", () => {
            if (editing !== -1) {
                saverule();
                document.getElementById("lgef-shield-rule-edit").style.display = "none";
            }
            delrule(i);
            saverule();
            loadrule();
        });
    }
    LGEFlog("rule", rules, editing);
}

/**
 *
 */
function initshield() {
    const fth = document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right")[0];
    if (fth.lastChild.id !== "lgef-shield") {
        const blk = document.createElement("div");
        blk.className = "lg-article";
        blk.id = "lgef-shield";
        blk.innerHTML = `
        <h2>犇犇屏蔽器</h2>
        <div id="lgef-shield-rule-edit" style="display: none;">
            <h3>编辑屏蔽规则</h3>
            <p>
                描述 <br> <input id="lgef-shield-rule-edit-desc" style="width: auto;"> <br>
                类型 <br> <select id="lgef-shield-rule-edit-mode" style="width: auto;">
                    <option value="include" selected>包含字符串</option>
                    <option value="regex">正则表达式匹配</option>
                </select> <br>
                内容 <br> <input id="lgef-shield-rule-edit-cont" style="width: auto;">
            </p>
            <p>
                <button id="lgef-shield-rule-btn-save" class="am-btn am-btn-primary am-btn-sm">保存</button>
                <button id="lgef-shield-rule-btn-cancel" class="am-btn am-btn-danger am-btn-sm">取消</button>
            </p>
        </div>
        <div id="lgef-shield-rules-show">
            <h3>屏蔽规则列表</h3>
            <table>
                <thead style="text-align: center;">
                    <tr>
                        <th>编号</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="lgef-shield-rules-show-body"></tbody>
            </table>
        </div>
        <button id="lgef-shield-rule-btn-new" class="am-btn am-btn-primary am-btn-sm">新建规则</button>
        `;
        fth.appendChild(blk);
        readrules();
        loadrule();
        document.getElementById("lgef-shield-rule-btn-save").addEventListener("click", () => {
            if (editing !== -1) {
                saverule();
                document.getElementById("lgef-shield-rule-edit").style.display = "none";
                loadrule();
            }
        });
        document.getElementById("lgef-shield-rule-btn-cancel").addEventListener("click", () => {
            if (editing !== -1) {
                editing = -1;
                document.getElementById("lgef-shield-rule-edit").style.display = "none";
                loadrule();
            }
        });
        document.getElementById("lgef-shield-rule-btn-new").addEventListener("click", () => {
            if (editing !== -1) {
                saverule();
            }
            newrule();
            document.getElementById("lgef-shield-rule-edit").style.display = "block";
        });
    }
}

/**
 *
 */
function runshield() {
    document.querySelectorAll(".am-comment-bd").forEach((e) => {
        rules.forEach((r) => {
            if (r[1] === 0) {
                if (e.innerText.indexOf(r[2]) !== -1) {
                    e.parentNode.parentNode.remove();
                }
            }
            if (r[1] === 1) {
                if (new RegExp(r[2]).test(e.innerText)) {
                    e.parentNode.parentNode.remove();
                }
            }
        });
    });
}

/**
 *
 */
function shield() {
    const element = document.getElementById("feed");
    const observer = new MutationObserver(() => { runshield(); });
    observer.observe(element, { childList: true, subtree: true });
}

// ------------------------------

/**
 *
 */
function start() {
    LGEFlog("Starting");
    const ur = /^\/user\/[0-9]+/,
        fr = /^\/$/,
        sh = /^\/$/;
    if (ur.test(document.location.pathname)) {
        LGEFlog("User rank");
        setInterval(userrank, 1000);
    }
    if (fr.test(document.location.pathname)) {
        LGEFlog("Following rank");
        initflwingrank();
        (async () => { flwingrank(); })();
    }
    if (sh.test(document.location.pathname)) {
        LGEFlog("Feed shield");
        initshield();
        (async () => { shield(); })();
    }
    LGEFlog("Started");
}

start();
