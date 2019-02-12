import Vue from 'vue';
import Vuex from 'vuex';

import http from './http';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: false,
        authToken: null,
        searchTerm: '',
        videoSearchResults: [],
        seriesSearchResults: [],
        currentSeries: null,
        currentVideo: null,
    },
    mutations: {
        setSearchTerm(state, term) {
            state.searchTerm = term;
        },
        setLoading(state, loading) {
            state.loading = loading;
        },
        setAuthToken(state, token) {
            state.authToken = token;
        },
        setVideoSearchResults(state, results) {
            state.videoSearchResults = results;
        },
        setSeriesSearchResults(state, results) {
            state.seriesSearchResults = results;
        },
        setCurrentSeries(state, series) {
            series.seasons = series.seasons.map(item => {
                item.episodeIds = item.episodes.map(ep => ep.id);

                return item;
            });
            state.currentSeries = series;
        },
        setCurrentVideo(state, video) {
            state.currentVideo = video;
        }
    },
    actions: {
        getAuthToken(context) {
            return http().get('/identity/anonymous-token?site=hoichoitv');
        },
        searchVideos(context, term) {
            context.commit('setLoading', true);
            http().get(`/search/v1?site=hoichoitv&types=VIDEO&languageCode=en&searchTerm=${term}`)
                .then(res => {
                    context.commit('setVideoSearchResults', res.data);
                    context.commit('setLoading', false);
                }).catch((err) => {
                    context.commit('setLoading', false);
                });
        },
        searchSeries(context, term) {
            context.commit('setLoading', true);
            http().get(`/search/v1?site=hoichoitv&types=SERIES&languageCode=en&searchTerm=${term}`)
                .then(res => {
                    context.commit('setSeriesSearchResults', res.data);
                    context.commit('setLoading', false);
                }).catch(err => {
                    context.commit('setLoading', false);
                });
        },
        getSeries(context, id) {
            return http().get(`/content/series?site=hoichoitv&id=${id}`);
        },
        callVideos(context, ids) {
            return http(this.state.authToken).get('/content/videos?site=hoichoitv&ids='+ids);
        },
        getSeasons(context, series) {
            context.commit('setLoading', true);
            let gotSeasons = series.seasons.map(async (item) => {
                let res = await context.dispatch('callVideos', item.episodeIds.join(','));
                let episodes = [];
                let records = res.data.records;
                item.episodeIds.forEach(id => {
                    episodes.push(records.filter(re => re.gist.id == id)[0]);
                });
                item.episodesInfo = episodes;

                return item;
            });

            Promise.all(gotSeasons).then((data) => {
                series.seasons = data;
                context.commit('setCurrentSeries', series);
                context.commit('setLoading', false);
            }).catch(err => {
                context.commit('setLoading', false);
            });
        }
    }
});