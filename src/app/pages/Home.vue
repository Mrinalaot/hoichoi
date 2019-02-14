<template>
    <div class="flex-1 flex flex-col">
        <navigation to="/">
            <i class="material-icons mr-2">airplay</i> Search, Stream &amp; Download
        </navigation>
        <div class="flex flex-col flex-1 items-center justify-center">
            <h1 class="font-hairline my-8">Hoichoi Search</h1>
            <input type="text" class="p-4 rounded border border-grey w-1/2" @keydown="searchType" 
                placeholder="Search" v-model="searchTerm">
            
            <transition name="slide" enter-active-class="slideInUp">
                <h2 class="mt-4 font-hairline" v-if="seriesSearchResults.length > 0">Series</h2>
            </transition>
            <div class="w-full flex mt-4 flex-wrap" v-if="seriesSearchResults.length > 0">
                <a href="javascript:void(0)" class="w-1/4 no-underline text-grey-darker" 
                    @click="onSeriesClick(series)"
                    v-for="series in seriesSearchResults" :key="series.id">
                    <card :item="series"></card>
                </a>
            </div>

            <transition name="slide" enter-active-class="slideInUp">
                <h2 class="mt-4 font-hairline" v-if="videoSearchResults.length > 0">Videos</h2>
            </transition>
            <div class="w-full flex mt-4 flex-wrap" v-if="videoSearchResults.length > 0">
                <a href="javascript:void(0);" @click="onVideoClick(video)" 
                    class="w-1/4 no-underline text-grey-darker" :to="`/video/${video.id}`" 
                    v-for="video in videoSearchResults" :key="video.id">
                    <card :item="video"></card>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import Card from '../components/Card.vue';
import Navigation from '../components/Navigation.vue';
import { mapActions, mapState } from 'vuex';

export default {
    components: { Card, Navigation },
    data() {
        return {
            searchTerm: ''
        }
    },
    computed: {
        ...mapState(['videoSearchResults', 'seriesSearchResults'])
    },
    methods: { 
        ...mapActions(['searchSeries', 'searchVideos', 'callVideos']),
        searchType(e) {
            if (e.keyCode == 13) {
                this.searchSeries(this.searchTerm);
                this.searchVideos(this.searchTerm);
            }
        },
        onSeriesClick(series) {
            this.$store.commit('setCurrentSeries', series);
            this.$router.push(`/series/${series.id}`);
        },
        onVideoClick(video) {
            this.callVideos(video.gist.id).then(res => {
                if (res.data.records.length > 0) {
                    this.$store.commit('setCurrentSeries', null);
                    this.$store.commit('setCurrentVideo', res.data.records[0]);
                    this.$router.push(`/video/${video.gist.id}`);
                }
            });
        },
    }
}
</script>
