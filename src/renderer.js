import Vue from 'vue';
import electron from 'electron';
import VueRouter from 'vue-router';
import VueVideoPlayer from 'vue-video-player';
import { Titlebar } from 'custom-electron-titlebar';

import App from './app/App.vue';
import routes from './app/router';
import http from './app/http';
import store from './app/store';
import menu from './menu';

new Titlebar({
    icon: './favicon.ico',
    menu
});


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