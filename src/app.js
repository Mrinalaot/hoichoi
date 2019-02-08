import Vue from 'vue';
import VueRouter from 'vue-router';
import VueVideoPlayer from 'vue-video-player';

import App from './App.vue';
import routes from './router';
import http from './http';
import store from './store';

Vue.prototype.$http = http();
Vue.prototype.$electron = Container.electron;

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