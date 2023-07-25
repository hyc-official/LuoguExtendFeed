import {
    LGEFlog, getapi, request, clrcache,
} from "./utils.js";

// ------------------------------

const rkname = [
    ["", "", ""],
    ["dragon", "犇犇30d龙王榜", "条"],
    ["dragond", "犇犇24h龙王榜", "条"],
    ["bell", "犇犇30d铃铛榜", "个"],
    ["at", "犇犇30d艾特榜", "次"],
];

/**
 *
 * @param row
 * @param cbk
 * @param stp
 */
function addrow(row, cbk, stp) {
    const rowhtml = "<div data-v-8b7f80ba=\"\"><span data-v-8b7f80ba=\"\"><span data-v-36d4a8df=\"\" data-v-8b7f80ba=\"\">%NAME%</span></span><span data-v-8b7f80ba=\"\"><span data-v-36d4a8df=\"\" data-v-8b7f80ba=\"\" class=\"info-content\">%INFO%</span></span></div>";
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
    const row = document.querySelectorAll(".info-rows")[0];
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

/**
 *
 * @param cbk
 * @param pge
 */
function getflwing(cbk = {}, pge = 0) {
    const pges = Math.ceil(_feInstance.currentUser.followingCount / 20);
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
                <option value="dragon" selected>30d龙王榜</option>
                <option value="dragond">24h龙王榜</option>
                <option value="bell">30d铃铛榜</option>
                <option value="at">30d艾特榜</option>
            </select>
        </p>
        <div id="lgef-flwing-rank-show">
            <center>加载中...</center>
        </div>
        <p><button id="lgef-clear-cache" class="am-btn am-btn-primary am-btn-sm">清除缓存</button></p>
        `;
        fth.appendChild(blk);
        document.getElementById("lgef-flwing-rank-type").addEventListener("change", () => {
            rankmode = document.getElementById("lgef-flwing-rank-type").selectedIndex;
            document.getElementById("lgef-flwing-rank-show").innerHTML = "<center>加载中...</center>";
            // eslint-disable-next-line no-use-before-define
            flwingrank();
        });
        document.getElementById("lgef-clear-cache").addEventListener("click", () => {
            clrcache();
            flwing.status = false;
            flwing.content = [];
            document.getElementById("lgef-flwing-rank-show").innerHTML = "<center>加载中...</center>";
            // eslint-disable-next-line no-use-before-define
            flwingrank();
        });
    }
}

/**
 *
 * @param rnk
 */
function showflwingrank(rnk) {
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
        rows += rowhtml.replace(/%RANK%/g, i + 1).replace(/%UID%/g, rnk[i][1].uid).replace(/%COLOR%/g, rnk[i][1].color.toLowerCase()).replace(/%NAME%/g, rnk[i][1].name)
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

/**
 *
 */
async function startflwingrank() {
    initflwingrank();
    flwingrank();
}

// ------------------------------

/**
 *
 */
function start() {
    LGEFlog("Starting");
    const ur = /^\/user\/[0-9]+/,
        fr = /^\/$/;
    if (ur.test(document.location.pathname)) {
        LGEFlog("User rank");
        setInterval(userrank, 1000);
    }
    if (fr.test(document.location.pathname)) {
        LGEFlog("Following rank");
        startflwingrank();
    }
    LGEFlog("Started");
}

start();
