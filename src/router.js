import Home from './pages/Home.vue';
import Directory from './pages/Directory.vue';
import Series from './pages/Series.vue';
import Video from './pages/Video.vue';

const routes = {
    routes: [
        { path: '/', component: Home },
        { path: '/directory', component: Directory },
        { path: '/series/:sid', component: Series },
        { path: '/video/:vid', component: Video },
    ]
}

export default routes;