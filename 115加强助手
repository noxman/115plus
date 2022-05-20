// ==UserScript==
// @name                115加强助手
// @namespace           http://tampermonkey.net/
// @version             0.1
// @description         115改名称并删除无用文件
// @author              noxman
// @include             https://115.com/*
// @include             https://v.anxia.com/*
// @license             MIT
// ==/UserScript==

(function () {
    // 按钮
    let rename_list = `
            <li id="rename_list">
                <a id="rename" class="rename" href="javascript:;">改名</a>
                <a id="mark" class="mark" href="javascript:;">标记</a>
                <a id="mfolder" class="mfolder" href="javascript:;">套文件夹</a>
            </li>
        `;
    /**
     * 添加按钮的定时任务
     */
    let rename_interval = setInterval(renameb, 1000);
    let msg_interval = setInterval(cleanmsg,5000);
    'use strict';
    /**
     * 自动清除消息
     */
    function cleanmsg() {
        let msg = $("em#js-ch-no_im");
        if (msg.text() > 0){
            $.post("https://msg.115.com/?ct=notice&ac=delete", {
                clean: '1',
                type: 'sys'
            },
                   function (data, status) {
                let result = JSON.parse(data);
                if (result.state === 1){
                    console.log('删除成功')
                }
            })
            msg.attr('style','display:none;')
            msg.text(0);
        }
    }
    /**
     * 添加按钮定时任务(检测到可以添加时添加按钮)
     */
    function renameb() {
        let open_dir = $("div#js_float_content li[val='open_dir']");
        if (open_dir.length !== 0 && $("li#rename_list").length === 0) {
            open_dir.before(rename_list);
            $("a#rename").click(
                function () {
                    $("div#js_float_content").attr('style', 'z-index: 9999999; top: 5px; left: 312px; display: none;');
                    getpid(rename_all);
                    setTimeout(function(){$("div#js_float_content li[val='refresh']").click()},1000);
                });
            $("a#mark").click(
                function () {
                    $("div#js_float_content").attr('style', 'z-index: 9999999; top: 5px; left: 312px; display: none;');
                    getpid(mark_all);
                    setTimeout(function(){$("div#js_float_content li[val='refresh']").click()},1000);
                });
            $("a#mfolder").click(
                function () {
                    $("div#js_float_content").attr('style', 'z-index: 9999999; top: 5px; left: 312px; display: none;');
                    getpid(mfolder_all);
                    setTimeout(function(){$("div#js_float_content li[val='refresh']").click()},1000);
                });
            console.log("添加按钮");
            // 结束定时任务
            clearInterval(rename_interval);
        }
    }

    /**
     * 执行改名方法
     * @param call       回调函数
     */
    function getpid(call) {
        // 获取所有已选择的文件
        let list = $("iframe[rel='wangpan']")
        .contents()
        .find("li.selected")
        .each(function (index, v) {
            let $item = $(v);
            // 原文件名称
            let file_name = $item.attr("title");
            // 文件类型
            let file_type = $item.attr("file_type");
            // 所在文件夹
            let folder = $item.attr("p_id");
            // 文件id
            let fid;
            let file_t;
            // 后缀名
            let suffix;
            if (file_type === "0") {
                // 文件夹
                fid = $item.attr("cate_id");
            } else {
                // 文件
                fid = $item.attr("file_id");
                // 处理后缀
                let lastIndexOf = file_name.lastIndexOf('.');
                if (lastIndexOf !== -1) {
                    suffix = file_name.substr(lastIndexOf);
                }
            }
            if (fid && file_name) {
                let fh = getVideoCode(file_name);
                if (fh) {
                    // 执行
                    call(fid, fh, suffix, file_type, folder);
                }
            }
        });
    }

    /**
     * 重命名
     */
    function rename_all(fid, fh, suffix, file_type, folder) {
        if (file_type === "0") {
            send_115(fid, fh)
            folder_files(fid, fh);
        } else {
            send_115(fid, fh + suffix);
        }
    }

    /**
     * 作标记
     */
    function mark_all(fid, fh, suffix, file_type, folder) {
        send_115(fid, fh + '下' + suffix);
    }

    /**
    * 嵌套文件夹
    */
    function mfolder_all(fid, fh, suffix, file_type, folder) {
        $.post("https://webapi.115.com/files/add", {
            pid: folder,
            cname: fh
        },
               function (data, status) {
            let result = JSON.parse(data);
            if (result.state){
                console.log('文件夹创建成功')
                $.post("https://webapi.115.com/files/move", {
                    pid: result.cid,
                    fid: [fid,]
                },
                       function (data, status) {
                    let result = JSON.parse(data);
                    if (result.state){
                        console.log('移动成功')
                    }
                })
            } else {
                $.get("https://webapi.115.com/files", {
                    show_dir: 1,
                    cid: folder,
                },
                      function (data, status) {
                    let result = JSON.parse(data);
                    if (result.state) {
                        $.each(result.data, function(idx, folder_data) {
                            if(typeof(folder_data.fid) == 'undefined') {
                                if (folder_data.n == fh) {
                                    console.log("文件夹");
                                    $.post("https://webapi.115.com/files/move", {
                                        pid: folder_data.cid,
                                        fid: [fid,]
                                    },
                                           function (data, status) {
                                        let result = JSON.parse(data);
                                        if (result.state){
                                            console.log('移动成功')
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    /**
     * 查找目录文件
     */
    function folder_files(fid, fh) {
        $.get("https://webapi.115.com/files", {
            cid: fid,
        },
              function (data, status) {
            let result = JSON.parse(data);
            if (result.state) {
                let v_count = 0;
                $.each(result.data, function(idx, file_data) {
                    let lastIndex = file_data.n.lastIndexOf('.');
                    if (lastIndex !== -1) {
                        let suffix = file_data.n.substr(lastIndex, file_data.n.length).toLowerCase();
                        let reg = /^[0-9][A-Za-z]/i;
                        if (suffix == ".mp4" || suffix ==".avi" || suffix == ".mkv" || suffix == ".wmv") {
                            if (file_data.s < 200 * 1024 * 1024) {
                                del_file(file_data.fid);
                            } else {
                                v_count += 1;
                            }
                        } else {
                            del_file(file_data.fid);
                        }
                    }
                });
                $.each(result.data, function(idx, file_data) {
                    let lastIndex = file_data.n.lastIndexOf('.');
                    if (lastIndex !== -1) {
                        let suffix = file_data.n.substr(lastIndex, file_data.n.length).toLowerCase();
                        let reg = /^[0-9][A-Za-z]/i;
                        if (suffix == ".mp4" || suffix ==".avi" || suffix == ".mkv" || suffix == ".wmv") {
                            if (v_count == 1) {
                                send_115(file_data.fid, fh + suffix);
                            } else {
                                let true_name = fh;
                                let name = file_data.n.substr(0, lastIndex).toLowerCase();
                                let cd_reg = /cd[1-4]/i;
                                let last1 = name.substring(name.length - 1);
                                let last2 = name.substring(name.length - 2);
                                let last3 = name.substring(name.length - 3);
                                let last5 = name.substring(name.length - 5);
                                if ((result = cd_reg.exec(name)) != null && result != last3){
                                    fh = fh + '-' + result.toUpperCase();
                                }
                                if (last5 == "part1" || last5 == "part2" || last5 == "part3" || last5 == "part4"){
                                    true_name = fh + '-' + last5.replace('part','CD');
                                }else if (last3 == "cd1" || last3 == "cd2" || last3 == "cd3" || last3 == "cd4") {
                                    true_name = fh + '-' + last3.toUpperCase();
                                } else if (last2 == "-1" || last2 == "-2" || last2 == "-3" || last2 == "-4" || last2 == "_1" || last2 == "_2" || last2 == "_3" || last2 == "_4"
                                           ||last2 == "-a" || last2 == "-b" || last2 == "-c" || last2 == "-d" || last2 == "-A" || last2 == "-B" || last2 == "-C" || last2 == "-D") {
                                    true_name = fh + last2.toUpperCase();
                                } else if (reg.test(last2)){
                                    if (last1 == "a" || last1 == "b" || last1 == "c" || last1 == "d") {
                                        true_name = fh + '-' + last1.toUpperCase();
                                    }
                                }
                                send_115(file_data.fid, true_name + suffix);
                            }
                        }
                    } else {
                        send_115(file_data.fid, fh + ".mp4");
                    }
                });
            } else {
                console.log("出现错误");
            }
        });
    }

    /**
     * 删除文件
     */
    function del_file(fid) {
        $.post("https://webapi.115.com/rb/delete", {
            fid: fid,
        },
               function (data, status) {
            let result = JSON.parse(data);
            console.log(result);
            if (result.state) {
                console.log("删除成功，可从回收站还原。");
            } else {
                console.log('删除失败:'+result.error);
            }
        });
    }

    /**
     * 请求115接口
     * @param id 文件id
     * @param name 要修改的名称
     * @param fh 番号
     */
    function send_115(fid, fh) {
        let file_name = stringStandard(fh);
        $.post("https://webapi.115.com/files/edit", {
            fid: fid,
            file_name: file_name
        },
               function (data, status) {
            let result = JSON.parse(data);
            if (!result.state) {
                console.log("请求115接口异常: " + unescape(result.error
                                                     .replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
            } else {
                console.log("修改文件名称,fh:" + fh);
            }
        }
              );
    }

    /**
     * 通知参数
     * @param text 内容
     * @param title 标题
     * @returns {{text: *, title: *, timeout: number}}
     */
    function getDetails(text, title) {
        return {
            text: text,
            title: title,
            timeout: 1000
        };
    }

    /**
     * 115名称不接受(\/:*?\"<>|)
     * @param name
     */
    function stringStandard(name) {
        return name.replace(/\\/g, "")
            .replace(/\//g, " ")
            .replace(/:/g, " ")
            .replace(/\?/g, " ")
            .replace(/"/g, " ")
            .replace(/</g, " ")
            .replace(/>/g, " ")
            .replace(/\|/g, "")
            .replace(/\*/g, " ");
    }

    /**
     * 获取番号
     * @param title         源标题
     * @returns {string}    提取的番号
     */
    function getVideoCode(title) {
        title = title.toUpperCase().replace("SIS001", "")
            .replace("1080P", "")
            .replace("720P", "");

        let t = title.match(/T28[\-_]\d{3,4}/);
        // 一本道
        if (!t) {
            t = title.match(/1PONDO[\-_]\d{6}[\-_]\d{2,4}/);
            if (t) {
                t = t.toString().replace("1PONDO_", "")
                    .replace("1PONDO-", "");
            }
        }
        if (!t) {
            t = title.match(/HEYZO[\-_]?\d{4}/);
        }
        if (!t) {
            // 加勒比
            t = title.match(/CARIB[\-_]\d{6}[\-_]\d{3}/);
            if (t) {
                t = t.toString().replace("CARIB-", "")
                    .replace("CARIB_", "");
            }
        }
        if (!t) {
            // 东京热
            t = title.match(/N[-_]\d{4}/);
        }
        if (!t) {
            // Jukujo-Club | 熟女俱乐部
            t = title.match(/JUKUJO[-_]\d{4}/);
        }
        // 通用
        if (!t) {
            t = title.match(/[A-Z]{2,5}[-_]\d{3,5}/);
        }
        if (!t) {
            t = title.match(/\d{6}[\-_]\d{2,4}/);
        }
        if (!t) {
            t = title.match(/[A-Z]+\d{3,5}/);
        }
        if (!t) {
            t = title.match(/[A-Za-z]+[-_]?\d+/);
        }
        if (!t) {
            t = title.match(/\d+[-_]?\d+/);
        }
        if (!t) {
            t = title;
        }
        if (t) {
            t = t.toString().replace("_", "-");
            if (t.indexOf("-") == -1){
                let reg_c = /[A-Z]+/;
                let reg_n = /\d{3,5}/;
                t = reg_c.exec(t) + '-' + reg_n.exec(t);
            }
            console.log("找到番号:" + t);
            return t;
        }
    }
})();
