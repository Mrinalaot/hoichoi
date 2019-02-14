<template>
    <transition name="slide" enter-active-class="slideInUp">
        <div class="p-2">
            <div class="rounded overflow-hidden shadow-lg" :class="active ? `bg-red-dark text-white` : ''">
                <img class="w-full" :src="image" :alt="item.gist.title">
                <div class="px-4 py-2">
                    <div class="mb-2" :class="tClass">{{ item.gist.title }}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: ['item', 'titleClass', 'active'],
    data() {
        return {
            defaultImage: 'https://via.placeholder.com/640x360?text=NO+IMAGE',
        }
    },
    computed: {
        image() {
            return this.item.gist.imageGist._16x9 ? this.item.gist.imageGist._16x9 : this.defaultImage;
        },
        tClass() {
            return this.titleClass ? this.titleClass : 'text-md';
        }
    },
}
</script>
