<template>
    <div class="min-h-screen flex flex-col" style="padding-top:38px;">
        <title-bar></title-bar>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <loading :active.sync="loading" 
                :can-cancel="false" 
                :is-full-page="true"></loading>
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { mapActions, mapState } from 'vuex';
import TitleBar from './components/TitleBar.vue';

export default {
    components: { Loading, TitleBar },
    computed: {
        ...mapState(['loading'])
    },
    created() {
        this.getAuthToken().then(res => {
            this.$store.commit('setAuthToken', res.data.authorizationToken);
        });
    },
    methods: {
        ...mapActions(['getAuthToken']),
    }
}
</script>
