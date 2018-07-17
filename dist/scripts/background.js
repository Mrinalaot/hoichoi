"use strict";chrome.runtime.onInstalled.addListener(function(o){console.log("previousVersion",o.previousVersion)}),chrome.tabs.onUpdated.addListener(function(o){console.log(o),chrome.pageAction.show(o)});
//# sourceMappingURL=background.js.map
