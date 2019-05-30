// ==UserScript==
// @name         Hoichoi
// @namespace    http://tzsk.github.io/
// @version      2.1
// @description  Hoichoi TV Downloader
// @author       tzsk
// @match        https://www.hoichoi.tv/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

(function () {
    'use strict';

    var Hoichoi = {
        path: 'https://prod-api.viewlift.com/content/videos/',
        note: `<span style="font-size:12px;">Chose quality to Stream or Download</span>`,
        retryCount: 1,
        attach() {
            var vm = this;
            var XHR = XMLHttpRequest.prototype;
            // Remember references to original methods
            var open = XHR.open;
            var send = XHR.send;

            // Overwrite native methods
            // Collect data:
            XHR.open = function (method, url) {
                this._method = method;
                this._url = url;
                return open.apply(this, arguments);
            };

            // Implement "ajaxSuccess" functionality
            XHR.send = function (postData) {
                this.addEventListener('load', function () {
                    vm.loaded(this);
                });
                return send.apply(this, arguments);
            };

            $(document).on('click', 'a.video-tray-item', function(e) {
                e.stopPropagation();
                window.open($(this).attr('href'), '_blank');
            });
        },
        parse(content) {
            var details = { title: content.gist.title, image: content.gist.videoImageUrl, videos: [] };

            if (content.streamingInfo.videoAssets.mpeg.length > 0) {
                content.streamingInfo.videoAssets.mpeg.forEach(function (item) {
                    var quality = item.renditionValue;
                    details.videos.push({
                        quality: quality.substr(1, quality.length),
                        url: item.url
                    });
                });
            }

            return details;
        },
        loaded(xhr) {
            if (xhr._url.includes(this.path)) {
                var episode = this.parse(JSON.parse(xhr.responseText));
                this.render(episode);
            }
        },
        render(info) {
            var vm = this;
            setTimeout(function() {
                var $prompt = $('.subscription-prompt .overlay');
                if ($prompt.length <= 0) {
                    if (vm.retryCount > 20) {
                        return;
                    }
                    console.log('Trying to find hoichoi stream');
                    vm.retryCount += 1;

                    return vm.render(info);
                }

                $prompt.find('p').html(`${info.title} <br> ${vm.note}`);
                $prompt.find('.button-container').html(vm.links(info.videos));
            }, 200);
        },
        links(videos) {
            var html = '';
            videos.forEach(function (video) {
                html += `<a href="${video.url}" target="_blank" class="cta button" style="margin-right:10px;">
                    ${video.quality}
                </a>`;
            });

            return html;
        },
        find() {
            var state = window.initialStoreState.page;
            if (state === undefined) {
                return;
            }
            if (state.data.title.toLowerCase() != 'video page') {
                return;
            }
            var data = state.data;
            var modules = data.modules.filter(function (item) {
                return item.moduleType == 'VideoDetailModule';
            });
            if (modules.length <= 0) {
                return;
            }
            var target = modules[0];
            if (target.contentData.length <= 0) {
                return;
            }

            var movie = this.parse(target.contentData[0]);
            this.render(movie);
        },
        init() {
            this.attach();
            this.find();
        }
    };

    Hoichoi.init();
})();
