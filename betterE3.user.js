// ==UserScript==
// @name        betterE3
// @namespace   Violentmonkey Scripts
// @match       *://e3p.nycu.edu.tw/my/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @version     1.1.2
// @author      Tails
// @description 2024/10/14 上午8:45:03
// @downloadURL https://raw.githubusercontent.com/PikachuTW/betterE3/refs/heads/main/betterE3.user.js
// @homepageURL https://github.com/PikachuTW/betterE3
// @require     https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// ==/UserScript==

'use strict';

const config = new MonkeyConfig({
    title: 'betterE3 設定',
    menuCommand: true,
    params: {
        sort_announcement: {
            label: '<b>首頁</b> 公告按照日期排序',
            field: 'k',
            type: 'checkbox',
            default: true
        },
        // remove_left_menu: {
        //     label: '首頁-移除左側清單',
        //     type: 'checkbox',
        //     default: true,
        // },
        remove_redundant: {
            label: '<b>首頁</b> 改善整個頁面，去除多餘資訊(真的好看很多!!)',
            type: 'checkbox',
            default: true,
        }
    }
});

openMonkeyConfig = () => {
    config.open();
}

const dropDownList = document.getElementById('carousel-item-main-2');
if (dropDownList) {
    dropDownList.innerHTML += '<div class="dropdown-divider"></div><a class="dropdown-item " role="menuitem" tabindex="-1" id="monkey-open">betterE3插件設定</a>'
    document.getElementById('monkey-open').addEventListener('click', openMonkeyConfig, true);
    GM_addStyle(`
    #monkey-open:hover{
        cursor: pointer;
    }`)
}

const remove = (selector) => {
    if (!selector) return console.error('The selector isnt given');
    const element = document.querySelector(selector);
    if (!element) return console.error(`cant find the element (${selector})`);
    try {
        element.remove();
    } catch (err) {
        console.error(err);
    }
}

const sortAnnouncement = () => {
    const newList = [];
    let language = 'tw';
    if (document.querySelector('div.popover-region:nth-child(3) > a').classList.contains('semi-transparent')) language = 'en';
    for (let pageNum = 1; ; pageNum += 1) {
        if (!document.querySelector(`#news_page_${pageNum}`)) break;
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
    let itemNum = 0;
    for (let pageNum = 1; ; pageNum += 1) {
        const page = document.querySelector(`#news_page_${pageNum}`);
        if (!page) break;
        document.querySelectorAll(`#news_page_${pageNum} > ul:nth-child(1) > li`).forEach((element) => {
            element.innerHTML = newList[itemNum].innerHTML;
            itemNum += 1;
        })
    }
    console.log(newList);
}

const disableCalendar = () => {
    remove('#layer2_right_cal');
    document.querySelector('#btn_dcpc_current_course_stu').remove();
    // document.querySelector('.layer2_right').remove();
    // GM_addStyle(`
    //     @media only screen and (max-width: 960px){
    //         .layer2_right {
    //             display: none;
    //         }
    //     }
    // `);
}

// const removeLeftMenu = () => {
//     document.querySelector('.layer2_left').remove();
//     document.querySelector('#instance-51-header').remove();
//     document.querySelector('.img2018_personal_plc').remove();
//     document.querySelector('#btn_dcpc_current_course_closed').remove();
//     document.querySelector('#btn_dcpc_school_resource').remove();
//     GM_addStyle(`
//             .layer2_right {
//                 flex: 1;
//                 max-width: 100%;
//                 box-shadow: none;
//                 height: auto;
//             }
//         `);
// }

const removeRedundant = () => {
    disableCalendar();
    // 移除頭貼
    remove('.img2018_personal_plc');
    GM_addStyle(`
        #layer2_right_current_course_left {
            margin-left: 0px;
            margin-top: 30px !important;
            margin-bottom: 30px !important;
        }
        .layer2_left {
            display: flex;
            align-items: center;
            flex-direction: column;
        }
        .btn2018_spplc {
            left: 0px;
            top: 20px;
        }`);
    // 移除「當期課程」
    remove('#instance-51-header');
    // 移除紅字
    remove('#layer2_right_current_course_stu > center')
    //移除一些空格
    document.querySelectorAll('div.mt-3:nth-child(1) > br').forEach((e) => e.outerHTML = '');
    // 把底線以下的連結刪掉
    let startRemove = false;
    document.querySelectorAll('#layer2_right_current_course_stu > *').forEach((element) => {
        if (element.tagName == 'HR') {
            startRemove = true;
        }
        if (startRemove) {
            element.remove();
        }
    })
    startRemove = false;
    document.querySelectorAll('#layer2_right_current_course_left > *').forEach((element) => {
        if (element.tagName == 'HR') {
            startRemove = true;
        }
        if (startRemove) {
            element.remove();
        }
    })
    // 移除焦點綜覽的沒用大標題
    for (e of ['#page-header', '#region-main-box > div:nth-child(1)', '#mail_menu']) {
        remove(e);
    }
    // 移除footer, 右下角問號
    remove('#page-footer');
    // remove不知道幹嘛的iframe元件(可能要注意)
    remove('div.mt-3:nth-child(1) > iframe:nth-child(2)');
    // 移除多餘的空白們
    document.getElementById('layer2_right_current_course_stu').outerHTML += '<br>';
    GM_addStyle(`.layer2_left{height: auto;margin-left:0rem;min-width:25%;width:auto;} .layer2_right{height: auto;flex:1;max-width:none;width:auto;}
        #inst51>div>div>div{margin-right:0rem;margin-left:0rem;}`)
    GM_addStyle(`@media only screen and (max-width: 960px) {
        .layer2_right{display:none;}}`)
    GM_addStyle(`div.mt-3:nth-child(1){margin-top:0rem !important;}`)
    try {
        const parentE = document.getElementById('layer2_right_school_resource').parentElement;
        parentE.querySelector('br:nth-of-type(2)').remove();
        parentE.innerHTML += '<br>';
    } catch (err) {
        console.error(err);
    }
}

if (config.get('sort_announcement')) sortAnnouncement();
// if (config.get('remove_left_menu')) removeLeftMenu();
if (config.get('remove_redundant')) removeRedundant();
