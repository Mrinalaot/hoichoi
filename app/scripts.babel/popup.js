'use strict';

(function(){
    let Hoichoi = {
        data: {link: '#', name: '', poster: '', quality: ''},
        update() {
            let poster = document.querySelector('img.tzsk-poster');
            let name = document.querySelector('.tzsk-name');
            let download = document.querySelector('.tzsk-download');
            let stream = document.querySelector('.tzsk-stream');

            poster.src = this.data.poster;
            name.innerHTML = this.data.name;
            let dText = 'Download';
            let sText = 'Stream';
            if (this.data.quality != '') {
                let post = ' in ' + this.data.quality;
                dText += post;
                sText += post;
            }
            download.querySelector('span').innerHTML = dText;
            stream.querySelector('span').innerHTML = sText;

            // download.href = this.data.link;
            stream.href = this.data.link;
        },
        toggle() {
            Array.from(document.querySelectorAll('.tzsk-loaded')).forEach(item => {
                if (item.style.display === 'none') {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        },
        init() {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {from: 'popup'}, (response) => {
                    if (response.status) {
                        this.data = Object.assign({}, this.data, response.data);
                        this.update();
                        this.toggle();
                    }
                });
            });

            document.querySelector('.tzsk-download').addEventListener('click', () => {
                chrome.downloads.download({
                    url: this.data.link,
                    filename: this.data.name+'.mp4',
                    conflictAction: 'prompt'
                });
            });
        }
    };

    Hoichoi.init();
})();