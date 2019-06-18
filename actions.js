import http from './http';
import config from './config';

export const getAuthToken = () => {
    return http().get('/identity/anonymous-token?site=hoichoitv');
}

export const searchVideos = term => {
    return http().get(`/search/v1?site=hoichoitv&types=VIDEO&languageCode=en&searchTerm=${term}`);
}

export const searchSeries = term => {
    return http().get(`/search/v1?site=hoichoitv&types=SERIES&languageCode=en&searchTerm=${term}`);
}

export const getLayout = () => {
    return fetch('https://tzsk.github.io/hoichoi.json').then(result => result.json());
}

export const getModules = (token) => {
    return http(token).get('/content/pages?path=/&site=hoichoitv');
}

export const getContent = (token, moduleIds) => {
    return http(token).get('/content/pages?path=/&includeContent=1&site=hoichoitv&modules='+moduleIds.join(','));
}

export const getSeries = (series, token) => {
    return new Promise((resolve, reject) => {
        let gotSeasons = series.seasons.map(async (item) => {
            let res = await getVideos(item.episodeIds.join(','), token);
            let episodes = [];
            let records = res.data.records;
            item.episodeIds.forEach(id => {
                episodes.push(records.filter(re => re.gist.id == id)[0]);
            });
            item.episodesInfo = episodes;

            return item;
        });

        Promise.all(gotSeasons).then((data) => {
            series.seasonsInfo = data.reverse();
            resolve(series);
        }).catch(err => {
            reject(err);
        });
    });
}

export const getVideos = (ids, token) => {
    return http(token).get('/content/videos?site=hoichoitv&ids='+ids);
}

export const getImage = item => {
    const defaultImage = 'https://via.placeholder.com/640x360?text=NO+IMAGE';
    if (! item.gist) {
        return defaultImage;
    }
    let images = item.gist.imageGist;
    return images._16x9 ? images._16x9 : defaultImage;
}

export const getVideoSources = data => {
    return data.streamingInfo.videoAssets.mpeg.map(item => {
        let label = item.renditionValue ? item.renditionValue.substr(1, item.renditionValue.length) : 'auto';
        return {
            type: "video/mp4",
            src: item.url,
            label,
            res: label.substr(0, label.length - 1),
        };
    });
}

export const submitIssueOrFeedback = data => {
    return fetch('https://api.github.com/repos/tzsk/hoichoi/issues', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${config.github}`, 
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json());
}