import http from './http';
import config from './config';
import Cache from './Cache';

export const getAuthToken = () => {
    return Cache.get('auth', () => {
        return http().get('/identity/anonymous-token?site=hoichoitv');
    }, 60 * 24 * 1);
}

export const searchVideos = term => {
    return http().get(`/search/v1?site=hoichoitv&types=VIDEO&languageCode=en&searchTerm=${term}`);
}

export const searchSeries = term => {
    return http().get(`/search/v1?site=hoichoitv&types=SERIES&languageCode=en&searchTerm=${term}`);
}

export const getLayout = () => {
    return Cache.get('layout', () => {
        return fetch('https://tzsk.github.io/hoichoi.json').then(result => result.json());
    }, 60 * 24 * 1);
}

export const getModules = (token) => {
    return Cache.get('modules', () => {
        return http(token).get('/content/pages?path=/&site=hoichoitv');
    }, 60 * 24 * 1);
}

export const getContent = (token, moduleIds) => {
    return Cache.get('content-' + moduleIds.join('-'), () => {
        return http(token).get('/content/pages?path=/&includeContent=1&site=hoichoitv&modules='+moduleIds.join(','));
    }, 60 * 24 * 1);
}

export const getSeries = (series, token) => {
    return Cache.get('series-'+series.id, () => {
        return http(token).get('/content/pages?path='+series.gist.permalink+'&includeContent=1&site=hoichoitv');
    }, 60 * 24 * 1);
}

export const getVideos = (ids, token) => {
    return Cache.get('videos-' + ids.split(',').join('-'), () => {
        return http(token).get('/content/videos?site=hoichoitv&ids='+ids);
    }, 60 * 24 * 5);
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