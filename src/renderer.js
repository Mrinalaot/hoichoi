import Vue from 'vue';
import electron from 'electron';
import VueRouter from 'vue-router';
import VueVideoPlayer from 'vue-video-player';
import { Titlebar } from 'custom-electron-titlebar';

import App from './app/App.vue';
import routes from './app/router';
import http from './app/http';
import store from './app/store';

const titleBar = new Titlebar({
    icon: './favicon.ico'
});

function openRepo() {
    electron.remote.shell.openExternal('https://github.com/tzsk/hoichoi');
}

const menu = new electron.remote.Menu();
menu.append(new electron.remote.MenuItem({
    label: 'Help',
    submenu: [{
        label: 'Give a Star',
        click: openRepo,
    }, {
        label: 'Report an Issue',
        click: openRepo,
    }]
}));

titleBar.updateMenu(menu);

Vue.prototype.$http = http();
Vue.prototype.$electron = electron;

Vue.use(VueRouter);
Vue.use(VueVideoPlayer);
let router = new VueRouter(routes);

new Vue({
    router,
    store,
    render(h) {
        return h(App);
    }
}).$mount('#app')