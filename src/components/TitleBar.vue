<template>
    <div class="flex justify-between p-2 bg-blue-dark fixed pin-t w-full">
        <div class="flex-1 flex items-center">
            <img src="favicon.ico" alt="Icon" class="w-4 mr-2">
            <b class="text-sm text-white">Hoichoi</b>
        </div>
        <a href="javascript:void(0)" @click="onClose()" 
            class="text-sm no-underline text-white bg-red flex items-center p-1">
            <i class="material-icons text-sm">close</i>
        </a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            window: null,
        };
    },
    mounted() {
        this.window = this.$electron.remote.getCurrentWindow();
    },
    methods: {
        onClose() {
            if (this.window) {
                this.window.close();
            }
        }
    }
}
</script>
