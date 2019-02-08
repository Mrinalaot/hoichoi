<template>
    <div class="flex flex-col">
        <navigation :to="backpage">
            <i class="material-icons">keyboard_arrow_left</i> Go Back to {{ postText }}
        </navigation>
        <div class="flex p-2" v-if="currentVideo">
            <video-player class="video-player-box shadow"
                ref="videoPlayer"
                :options="playerOptions"
                :playsinline="true"></video-player>
            <div class="flex flex-col justify-center px-4">
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
    </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import { mapState, mapActions } from 'vuex';
import { videoPlayer } from 'vue-video-player';
import '../resolutionSwitcher';
import Navigation from '../components/Navigation.vue';

export default {
    components: { videoPlayer, Navigation },
    data() {
        return {
            backpage: '/',
            postText: 'Search',
        };
    },
    computed: {
        ...mapState(['currentVideo']),
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
        ...mapActions(['callVideos', 'getAuthToken']),
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
            // console.log(source);
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
        }
    }
}
</script>

<style>
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
