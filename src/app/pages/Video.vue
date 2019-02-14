<template>
    <div class="flex flex-col">
        <navigation :to="backpage">
            <i class="material-icons">keyboard_arrow_left</i> Go Back to {{ postText }}
        </navigation>
        <div class="flex p-2" v-if="currentVideo">
            <video-player class="video-player-box shadow"
                ref="videoPlayer"
                :options="playerOptions"
                @ended="onPlayerEnded($event)"
                @ready="playerReadied"
                :playsinline="true"></video-player>
            <div class="flex flex-col justify-center px-4">
                <div class="flex justify-between" v-if="currentSeries">
                    <a href="javascript:void(0);" :class="currentIndex ? `bg-red-dark`: `bg-grey-dark`"
                        @click="playPreviousVideo()"
                        class="no-underline flex items-center justify-center text-white p-2 rounded-full">
                        <i class="material-icons next-prev">skip_previous</i>
                    </a>
                    <a href="javascript:void(0);" @click="playNextVideo()"
                        :class="currentIndex == currentQueue.length - 1 ? `bg-grey-dark`: `bg-red-dark`"
                        class="no-underline flex items-center justify-center text-white p-2 rounded-full">
                        <i class="material-icons next-prev">skip_next</i>
                    </a>
                </div>
                <div class="flex-1 flex flex-col justify-center">
                    <h1 class="my-4 font-hairline">{{ currentVideo.gist.title }}</h1>
                    <p>{{ currentVideo.gist.description }}</p>
                </div>
                <div class="flex">
                    <a href="javascript:void(0);" 
                        class="px-8 py-2 mr-4 border border-red rounded shadow text-center no-underline text-sm font-bold text-red-light flex items-center"
                        v-for="source in getVideoSources()" :key="source.label" 
                        @click="onDownloadClick(source)"
                        ><i class="material-icons mr-2 text-sm">cloud_download</i> {{ source.label }}</a>
                </div>
            </div>
        </div>
        <div v-if="currentSeries">
            <div class="flex flex-col p-2" v-for="season in currentSeries.seasons" :key="season.id">
                <h3 class="mx-2 my-4">{{ season.title }}</h3>
                <div class="flex flex-wrap" v-if="season.episodesInfo">
                    <div class="w-1/5 p-2" v-for="episode in season.episodesInfo" :key="episode.gist.id">
                        <a href="javascript:void(0);" @click="onVideoClick(episode)" class="no-underline text-grey-darker" :to="`/video/${episode.gist.id}`">
                            <card :item="episode" title-class="text-sm" :active="episode.gist.id == currentVideo.gist.id"></card>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { videoPlayer } from 'vue-video-player';
import '../resolutionSwitcher';
import Card from '../components/Card.vue';
import Navigation from '../components/Navigation.vue';

export default {
    components: { videoPlayer, Navigation, Card },
    data() {
        return {
            backpage: '/',
            postText: 'Search',
            currentQueue: [],
            currentIndex: 0,
        };
    },
    computed: {
        ...mapState(['currentSeries', 'currentVideo']),
        playerOptions() {
            let sources = this.getVideoSources();
            return {
                sources,
                controls: true,
                poster: this.currentVideo.gist.videoImageUrl,
                plugins: {
                    videoJsResolutionSwitcher: {
                        default: 'low',
                        dynamicLabel: true
                    }
                }
            };
        }
    },
    mounted() {
        if (this.$route.query.ref) {
            this.backpage = `/series/${this.$route.query.ref}`;
            this.postText = 'Series';
            this.fetchSeries(this.$route.query.ref);
        }
        if (! this.currentVideo) {
            if (! this.$store.state.authToken) {
                this.getAuthToken().then(res => {
                    this.$store.commit('setAuthToken', res.data.authorizationToken);

                    this.fetchVideo();
                });
            } else {
                this.fetchVideo();
            }
        }
    },
    methods: {
        ...mapActions(['callVideos', 'getAuthToken', 'getSeries', 'getSeasons']),
        fetchVideo() {
            this.callVideos(this.$route.params.vid).then(res => {
                if (res.data.records.length > 0) {
                    this.$store.commit('setCurrentVideo', res.data.records[0]);
                }
            });
        },
        onDownloadClick(source) {
            this.$electron.ipcRenderer.send('download-video', {
                title: this.currentVideo.gist.title,
                source,
            });
        },
        getVideoSources() {
            return this.currentVideo.streamingInfo.videoAssets.mpeg.map(item => {
                let label = item.renditionValue.substr(1, item.renditionValue.length);
                return {
                    type: "video/mp4",
                    src: item.url,
                    label,
                    res: label.substr(0, label.length - 1),
                };
            });
        },
        fetchSeries(sid) {
            if (! this.currentSeries) {
                this.getSeries(sid).then(res => {
                    this.$store.commit('setCurrentSeries', res.data);
                    this.fetchSeasons();
                });
            } else {
                this.prepareQueue(this.currentSeries.seasons);
            }
        },
        fetchSeasons() {
            if (! this.$store.state.authToken) {
                this.getAuthToken().then(res => {
                    this.$store.commit('setAuthToken', res.data.authorizationToken);

                    this.getSeasons(this.$store.state.currentSeries)
                        .then(seasons => this.prepareQueue(seasons));
                });
            } else {
                this.getSeasons(this.$store.state.currentSeries)
                    .then(seasons => this.prepareQueue(seasons));
            }
        },
        prepareQueue(seasons) {
            let queue = [];
            let index = 0;
            seasons.forEach(season => {
                season.episodesInfo.forEach(ep => {
                    queue.push(ep);
                    if (ep.gist.id == this.currentVideo.gist.id) {
                        this.currentIndex = index;
                    }
                    index++;
                });
            });
            this.currentQueue = queue;
        },
        onVideoClick(video) {
            this.$store.commit('setCurrentVideo', video);

            this.$router.push(`/video/${video.gist.id}?ref=${this.$route.query.ref}&autoplay=1`);
            this.prepareQueue(this.currentSeries.seasons);
        },
        playNextVideo() {
            if (this.currentIndex < this.currentQueue.length) {
                this.currentIndex += 1;
                this.onVideoClick(this.currentQueue[this.currentIndex]);
            } 
        },
        playPreviousVideo() {
            if (this.currentIndex) {
                this.currentIndex -= 1;
                this.onVideoClick(this.currentQueue[this.currentIndex]);
            }
        },
        playerReadied(e) {
            if (this.$route.query.autoplay == 1) {
                e.play();
            }
        },
        onPlayerEnded(e) {
            if (this.currentSeries) {
                this.playNextVideo();
            }
        }
    }
}
</script>

<style>
.next-prev {font-size: 32px;}

.video-js, .video-player-box {width: 640px;height: 360px;}
.video-js .vjs-big-play-button {
    top: 40%;
    left: 42%;
}

.vjs-resolution-button .vjs-menu-icon:before {
  content: '\f110';
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
  font-size: 1.8em;
  line-height: 1.67em;
}

.vjs-resolution-button .vjs-resolution-button-label {
  font-size: 1em;
  line-height: 3em;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  box-sizing: inherit;
}

.vjs-resolution-button .vjs-menu .vjs-menu-content {
  width: 4em;
  left: 50%; /* Center the menu, in it's parent */
  margin-left: -2em; /* half of width, to center */
}

.vjs-resolution-button .vjs-menu li {
  text-transform: none;
  font-size: 1em;
}
</style>
