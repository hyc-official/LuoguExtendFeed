const indep = true;

const css = "color: #5EB95E;";

/**
 *
 * @param str
 * @param {...any} s
 */
function LGEFlog(str, ...s) {
    console.log(`%c[lgef] ${str}`, css, ...s);
}

/**
 *
 * @param key
 */
function getcache(key) {
    const res = {};
    LGEFlog("Find cache", key);
    const d = new Date(),
        e = new Date(),
        n = new Date().getTime();
    d.setTime(parseInt(GM_getValue(`cache/time_${key}`, "0"), 10));
    e.setTime(parseInt(GM_getValue(`cache/expired`, "0"), 10));
    if (d === 0) {
        LGEFlog("Cache miss");
        res.status = "miss";
    } else if (n - d > 300000 || d < e) {
        LGEFlog("Cache expired");
        res.status = "expired";
    } else {
        LGEFlog("Cache hit");
        res.status = "hit";
        res.content = GM_getValue(`cache/content_${key}`);
    }
    return res;
}
/**
 *
 * @param key
 * @param cont
 */
function setcache(key, cont) {
    LGEFlog("Set cache", key);
    GM_setValue(`cache/content_${key}`, cont);
    GM_setValue(`cache/time_${key}`, new Date().getTime().toString());
}
/**
 *
 */
function clrcache() {
    LGEFlog("Clear cache");
    GM_setValue("cache/expired", new Date().getTime().toString());
}
/**
 *
 */
function getcacheextime() {
    return parseInt(GM_getValue("cache/expired", "0"), 10);
}

/**
 *
 * @param url
 * @param call
 * @param s
 */
function request(url, call, ...s) {
    const c = getcache(url);
    if (c.status === "hit") {
        call(JSON.parse(c.content), ...s);
    } else {
        LGEFlog("Request", url);
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload(response) {
                LGEFlog("Request", `success: HTTP ${response.status}`);
                const res = {
                    error: false,
                    status: response.status,
                    content: response.responseText,
                };
                if (response.status === 200) {
                    setcache(url, JSON.stringify(res));
                }
                call(res, ...s);
            },
            onerror() {
                LGEFlog("Request", "failed");
            },
        });
    }
}

const api = {
    dragon: "/rank/dragon",
    dragond: "/rank/dailyDragon",
    bell: "/rank/bePinged",
    at: "/rank/pingOthers",
};
/**
 *
 * @param name
 * @param para
 * @param call
 * @param s
 */
function getapi(name, para, call, ...s) {
    LGEFlog("Get API", name);
    let url = `https://api-lgf.imken.moe${api[name]}`;
    for (const i in para) {
        url = url.replaceAll(`{${i}}`, para[i]);
    }
    request(url, call, ...s);
}

export {
    indep, LGEFlog, getcache, setcache, clrcache, getcacheextime, request, getapi,
};
