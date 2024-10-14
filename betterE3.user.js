// ==UserScript==
// @name        betterE3
// @namespace   Violentmonkey Scripts
// @match       *://e3p.nycu.edu.tw/my
// @grant       none
// @version     1.0
// @author      Tails
// @description 2024/10/14 上午8:45:03
// ==/UserScript==

(() => {
    'use strict';
    const newList = [];
    for (let pageNum = 1; ; pageNum += 1) {
        const page = document.querySelector(`#news_page_${pageNum}`);
        if (!page) break;
        document.querySelectorAll(`#news_page_${pageNum} > ul:nth-child(1) > li`).forEach((element) => {
            let date = new Date();
            const parsed = element.textContent.match(/(\d+)月 (\d+)日,(\d+):(\d+)*/);
            date.setMonth(parseInt(parsed[1]) - 1);
            date.setDate(parseInt(parsed[2]));
            date.setHours(parseInt(parsed[3]));
            date.setMinutes(parseInt(parsed[3]));
            newList.push({
                date,
                innerHTML: element.innerHTML,
            })
        })
    }
    newList.sort((a, b) => a.date < b.date);
    console.log(newList);
    let itemNum = 0;
    for (let pageNum = 1; ; pageNum += 1) {
        const page = document.querySelector(`#news_page_${pageNum}`);
        if (!page) break;
        document.querySelectorAll(`#news_page_${pageNum} > ul:nth-child(1) > li`).forEach((element) => {
            element.innerHTML = newList[itemNum].innerHTML;
            itemNum += 1;
        })
    }
})();