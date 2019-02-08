<template>
    <div class="flex items-center justify-between bg-black p-4">
        <router-link :to="to" class="no-underline text-red-light font-bold flex items-center">
            <slot></slot>
        </router-link>
        <a href="javascript:void(0);" class="text-red-light no-underline"
        title="Reload window"
        @click="onRefresh()"><i class="material-icons">refresh</i></a>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: ['to'],
    data() {
        return {
            window: null
        };
    },
    computed: {
        ...mapState(['hasError'])
    },
    mounted() {
        this.window = this.$electron.remote.getCurrentWindow();
    },
    methods: {
        onRefresh() {
            if (this.window) {
                this.window.reload();
            }
        }
    }
}
</script>
