"use strict";!function(){var e={regex:/http(s|)\:\/\/(www\.|)hoichoi\.tv\/(.*)/gm,regexMovies:/http(s|)\:\/\/(www\.|)hoichoi\.tv\/films\/(.*)/gm,interval:null,link:"",file:"",poster:"",quality:"",classes:{card:".video-tray-item",quality:".vjs-resolution-menu li",video:".vjs-tech",showTitle:".episode-name .name",movieTitle:"h1.header-title",poster:".vjs-poster",currentQuality:".current-resolution"},data:{},detect:function(e){for(var t=void 0,i=!1;null!==(t=e.exec(window.location.href));)t.index===e.lastIndex&&e.lastIndex++,t.forEach(function(e,t){i=!0});return i},register:function(){var e=this;$(document).on("click",this.classes.card,function(){e.lookup()}),$(document).on("click",this.classes.quality,function(){e.lookup()}),this.detect(this.regexMovies)&&this.lookup()},check:function(){var e=document.querySelector(this.classes.video);if(e){var t=document.querySelectorAll(this.classes.showTitle)[1],i=document.querySelector(this.classes.movieTitle);t?this.file=t.innerText:i?this.file=i.innerText:this.file="File Name Here",console.log("Ready to Hoichoi...");var s=document.querySelector(this.classes.poster);if(s){var o=s.currentStyle||window.getComputedStyle(s,!1),n=o.backgroundImage.slice(4,-1).replace(/"/g,"");this.poster=n}var r=document.querySelector(this.classes.currentQuality);r&&(this.quality=r.innerText),this.link=e.src,this.show()}},lookup:function(){var e=this;console.log("Looking Up..."),this.interval&&clearInterval(this.interval),this.interval=setInterval(function(){e.check()},2e3)},show:function(){this.data={link:this.link,name:this.file,poster:this.poster,quality:this.quality},this.interval&&clearInterval(this.interval)},init:function(){var e=this;this.detect(this.regex)&&(this.register(),chrome.runtime.onMessage.addListener(function(t,i,s){var o={status:!1,data:e.data};"popup"==t.from&&""!=e.link&&(o.status=!0),s(o)}))}};e.init()}();
//# sourceMappingURL=contentscript.js.map