// ==UserScript==
// @name         Hoichoi
// @namespace    http://tzsk.github.io/
// @version      1.0
// @description  Hoichoi TV Downloader
// @author       tzsk
// @match        https://www.hoichoi.tv/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

(function() {
    'use strict';

    var src ='';
    var button = false;
    var interval;
    var fileName ='';

    $(document).on('click', '.video-tray-item', function () {
        if (interval) {
            clearTimeout(interval);
        }
        interval = setInterval(check, 2000);
    });

    $(document).on('click', '.vjs-resolution-menu li', function () {
        if (interval) {
            clearTimeout(interval);
        }
        interval = setInterval(check, 2000);
    });

    function check(){
        var videoLink = document.querySelector('.vjs-tech');
        if(videoLink){
            fileName = document.querySelector(".episode-name .name").innerText;
            console.log('Ready to Hoichoi...');

            clearTimeout(interval);
            src = videoLink.src;
            showButton();
        }
    }

    function showButton() {
        if (button) {
            $('.tzsk-download').remove();
            button = false;
        }
        if (! button) {
            var quality = $('.current-resolution').text();
            var style = 'font-weight:bold;';
            var node = '<a href="#" download="'+fileName+
                '.mp4" class="tzsk-download site-color" style="'+style+
                '">Download in '+quality+'</a>';
            $('.overlay-episode-details').append(node);
        }
        $('.tzsk_download').attr('href', src);
        button = true;
        if (interval) {
            clearTimeout(interval);
        }
    }

    $(document).on('click', '.tzsk-download', function(e) {
        e.preventDefault();
        alert("Right Click and then click 'Save link as' to download");
        return false;
    });
})();