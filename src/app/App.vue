<template>
    <div class="min-h-full w-full flex flex-col">
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
import { mapActions, mapState } from 'vuex';

export default {
    components: { Loading },
    computed: {
        ...mapState(['loading'])
    },
    created() {
        this.getAuthToken().then(res => {
            this.$store.commit('setAuthToken', res.data.authorizationToken);
        });
    },
    methods: {
        ...mapActions(['getAuthToken'])
    }
}
</script>
