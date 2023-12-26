// ==UserScript==
// @name         Copy magnet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加复制magnet按钮!
// @author       Noxman
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAEPSURBVDhPrZFLa8JAGEXz6xW6ciEIIt2IiJWKUCRQQ31QRdCFtGmIrVFTCFTEVzFub72DIymZJFL6wSEDk5y5d6L929SaAzwY/V9U9R7O28ljeT6my+OFjy8fw/kB9x3nOsnQ2aJrbzGaHdGeHGBYOzReffHM61ayhKfZ3reApwfTEIpzZSNaxARC4K4g61AkZRTEShi1Ze/Rm6xFd9ZhFcI193XTF7XSBT0s4UvW5w6muxFPwtNlrSD151lY0DZP0U8fiQpngepjovwzxtsGhCLeByNHcfs4DQvYnfEJBXKtovL0HhbcdRdoDFx0Xry/CYIj6iiiS5QVgsN7GDvRJCa4yZYQRypTjBdcP5r2Aw0Q7Ehr7WCtAAAAAElFTkSuQmCC
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';
    var urlmag=/^magnet:\?xt=urn:btih:.*$/;
    $('a').each(function(){
        var link=$(this).attr("href");
        if(urlmag.test(link))
        {
            $(this).after('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAEPSURBVDhPrZFLa8JAGEXz6xW6ciEIIt2IiJWKUCRQQ31QRdCFtGmIrVFTCFTEVzFub72DIymZJFL6wSEDk5y5d6L929SaAzwY/V9U9R7O28ljeT6my+OFjy8fw/kB9x3nOsnQ2aJrbzGaHdGeHGBYOzReffHM61ayhKfZ3reApwfTEIpzZSNaxARC4K4g61AkZRTEShi1Ze/Rm6xFd9ZhFcI193XTF7XSBT0s4UvW5w6muxFPwtNlrSD151lY0DZP0U8fiQpngepjovwzxtsGhCLeByNHcfs4DQvYnfEJBXKtovL0HhbcdRdoDFx0Xry/CYIj6iiiS5QVgsN7GDvRJCa4yZYQRypTjBdcP5r2Aw0Q7Ehr7WCtAAAAAElFTkSuQmCC" class="magnet-copy" data-href='+link+' style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;">');
        }
    })
    $(document).on('click', '.magnet-copy', function(e) {
        e.preventDefault();
        GM_setClipboard($(this).data('href'));
        GM_notification('复制成功！', '提示');
    });
})();
