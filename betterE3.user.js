// ==UserScript==
// @name        betterE3
// @namespace   Violentmonkey Scripts
// @match       *://e3p.nycu.edu.tw/my/*
// @grant       none
// @version     1.0
// @author      Tails
// @description 2024/10/14 上午8:45:03
// ==/UserScript==

(() => {
    'use strict';
    const newList = [];
    let language = 'tw';
    if (document.querySelector('div.popover-region:nth-child(3) > a').classList.contains('semi-transparent')) language = 'en';
    for (let pageNum = 1; ; pageNum += 1) {
        const page = document.querySelector(`#news_page_${pageNum}`);
        if (!page) break;
        document.querySelectorAll(`#news_page_${pageNum} > ul:nth-child(1) > li`).forEach((element) => {
            let date = new Date();
            if (language == 'tw') {
                const parsed = element.textContent.match(/(\d+)月 (\d+)日,(\d+):(\d+)*/);
                date.setMonth(parseInt(parsed[1]) - 1);
                date.setDate(parseInt(parsed[2]));
                date.setHours(parseInt(parsed[3]));
                date.setMinutes(parseInt(parsed[4]));
            } else {
                const parsed = element.textContent.match(/(\d+) (\w+), (\d+):(\d+)/);
                date.setDate(parseInt(parsed[1]));
                date.setMonth(new Date(Date.parse(parsed[2] + " 1, 2024")).getMonth());
                date.setHours(parseInt(parsed[3]));
                date.setMinutes(parseInt(parsed[4]));
            }
            newList.push({
                date,
                innerHTML: element.innerHTML,
            })
        })
    }
    newList.sort((a, b) => b.date - a.date);
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