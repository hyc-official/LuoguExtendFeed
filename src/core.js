import {
    LGEFlog, getapi,
} from "./utils.js";

const rowhtml = "<div data-v-8b7f80ba=\"\"><span data-v-8b7f80ba=\"\"><span data-v-36d4a8df=\"\" data-v-8b7f80ba=\"\">%NAME%</span></span><span data-v-8b7f80ba=\"\"><span data-v-36d4a8df=\"\" data-v-8b7f80ba=\"\" class=\"info-content\">%INFO%</span></span></div>";
const rkname = [
    ["", "", ""],
    ["dragon", "犇犇30d龙王榜", "条"],
    ["dragond", "犇犇24h龙王榜", "条"],
    ["bell", "犇犇铃铛榜", "个"],
    ["at", "犇犇艾特榜", "次"],
];

/**
 *
 * @param row
 * @param cbk
 * @param stp
 */
function addrow(row, cbk, stp) {
    LGEFlog(`Add row "${rkname[stp][0]}"`);
    let rk = 0;
    for (let i = 0; i < cbk.content.length; i++) {
        if (cbk.content[i].uid === _feInstance.currentData.user.uid) {
            rk = i + 1;
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

/**
 *
 */
function start() {
    LGEFlog("Starting");
    const ur = /^\/user\/[0-9]+/;
    if (ur.test(document.location.pathname)) {
        LGEFlog("User rank");
        setInterval(userrank, 1000);
    }
    LGEFlog("Started");
}

start();
