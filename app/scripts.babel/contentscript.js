'use strict';

(function() {
    let Hoichoi = {
        regex: /http(s|)\:\/\/(www\.|)hoichoi\.tv\/(.*)/gm,
        regexMovies: /http(s|)\:\/\/(www\.|)hoichoi\.tv\/films\/(.*)/gm,
        interval: null,
        link: '',
        file: '',
        poster: '',
        quality: '',
        classes: {
            card: '.video-tray-item',
            quality: '.vjs-resolution-menu li',
            video: '.vjs-tech',
            showTitle: '.episode-name .name',
            movieTitle: 'h1.header-title',
            poster: '.vjs-poster',
            currentQuality: '.current-resolution'
        },
        data: {},
        detect: function (regex) {
            let m, detected = false;
            while ((m = regex.exec(window.location.href)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                m.forEach((match, groupIndex) => {
                    detected = true;
                });
            }

            return detected;
        },
        register: function () {
            $(document).on('click', this.classes.card, () => {
                this.lookup();
            });
            $(document).on('click', this.classes.quality, () => {
                this.lookup();
            });
            if (this.detect(this.regexMovies)) {
                this.lookup();
            }
        },
        check: function () {
            let video = document.querySelector(this.classes.video);
            if(video) {
                let showName = document.querySelectorAll(this.classes.showTitle)[1];
                let movieName = document.querySelector(this.classes.movieTitle);
                if (showName) {
                    this.file = showName.innerText;
                } else if (movieName) {
                    this.file = movieName.innerText;
                } else {
                    this.file = 'File Name Here';
                }
                console.log('Ready to Hoichoi...');

                let img = document.querySelector(this.classes.poster);
                if (img) {
                    let style = img.currentStyle || window.getComputedStyle(img, false),
                        bi = style.backgroundImage.slice(4, -1).replace(/"/g, '');

                    this.poster = bi;
                }
                let q = document.querySelector(this.classes.currentQuality);
                if (q) {
                    this.quality = q.innerText;
                }
    
                this.link = video.src;
                this.show();
            }
        },
        lookup: function () {
            console.log('Looking Up...');
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.interval = setInterval(() => {
                this.check();
            }, 2000);
        },
        show: function () {
            this.data = {link: this.link, name: this.file, poster: this.poster, quality: this.quality};

            if (this.interval) {
                clearInterval(this.interval);
            }
        },
        init: function () {
            if (this.detect(this.regex)) {
                this.register();

                chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                    let response = {status: false, data: this.data};
                    if (request.from == 'popup' && this.link != '') {
                        response.status = true;
                    } 
                    sendResponse(response);
                });
            }
        }
    };

    Hoichoi.init();
})();

