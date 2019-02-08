<template>
    <div v-if="currentSeries" class="flex flex-col">
        <navigation to="/">
            <i class="material-icons">keyboard_arrow_left</i> Go Back to Search
        </navigation>
        <div class="flex items-center p-4">
            <img :src="currentSeries.gist.imageGist._16x9" :alt="currentSeries.gist.title" class="w-1/3 rounded">
            <div class="flex-1 p-4">
                <h1 class="my-4 font-hairline">{{ currentSeries.gist.title }}</h1>
                <p>{{ currentSeries.gist.description }}</p>
            </div>
        </div>
        <div class="flex flex-col p-2" v-for="season in currentSeries.seasons" :key="season.id">
            <h3 class="mx-2 my-4">{{ season.title }}</h3>
            <div class="flex flex-wrap" v-if="season.episodesInfo">
                <div class="w-1/5 p-2" v-for="episode in season.episodesInfo" :key="episode.gist.id">
                    <a href="javascript:void(0);" @click="onVideoClick(episode)" class="no-underline text-grey-darker" :to="`/video/${episode.gist.id}`">
                        <card :item="episode" title-class="text-sm"></card>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Card from '../components/Card.vue';
import { mapState, mapActions } from 'vuex';
import Navigation from '../components/Navigation.vue';

export default {
    components: { Card, Navigation },
    data() {
        return {
            seasons: [],
        };
    },
    computed: {
        ...mapState(['currentSeries'])
    },
    mounted() {
        if (! this.currentSeries) {
            this.getSeries(this.$route.params.sid).then(res => {
                this.$store.commit('setCurrentSeries', res.data);
                this.fetchSeasons();
            });
        } else {
            this.fetchSeasons();
        }
    },
    methods: {
        ...mapActions(['getSeries', 'getSeasons', 'getAuthToken']),
        fetchSeasons() {
            if (! this.$store.state.authToken) {
                this.getAuthToken().then(res => {
                    this.$store.commit('setAuthToken', res.data.authorizationToken);

                    this.getSeasons(this.$store.state.currentSeries);
                });
            } else {
                this.getSeasons(this.$store.state.currentSeries);
            }
        },
        onVideoClick(video) {
            this.$store.commit('setCurrentVideo', video);

            this.$router.push(`/video/${video.gist.id}?ref=${this.$route.params.sid}`);
        }
    }
}
</script>
