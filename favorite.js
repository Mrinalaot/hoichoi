import { AsyncStorage, ToastAndroid } from 'react-native';

class Storage {
    async get(key) {
        let results = await AsyncStorage.getItem(key);
        return JSON.parse(results);
    }

    set(key, data) {
        return AsyncStorage.setItem(key, JSON.stringify(data));
    }

    delete(key) {
        return AsyncStorage.removeItem(key);
    }
}

class Entity {
    constructor() {
        this.storage = new Storage;
    }

    get() {
        return this.storage.get(this.ITEMS);
    }

    async set(entity) {
        let items = await this.storage.get(this.ITEMS);

        let itemsData = Array.isArray(items) ? [...items, entity] : [entity];
        let idsData = itemsData.map(item => this.getId(item));

        await this.storage.set(this.ITEMS, itemsData);
        await this.storage.set(this.IDS, idsData)

        ToastAndroid.showWithGravity('Added to favorites', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }

    async has(entity) {
        let ids = await this.storage.get(this.IDS);
        
        return ids ? ids.indexOf(this.getId(entity)) >= 0 : false;
    }

    async delete(entity) {
        let items = await this.storage.get(this.ITEMS);
        let ids = await this.storage.get(this.IDS);
        if (! items) {
            return;
        }

        let index = items.findIndex(item => this.getId(item) == this.getId(entity));
        items.splice(index, 1);
        await this.storage.set(this.ITEMS, items);
        ids.splice(ids.indexOf(this.getId(entity)), 1);
        await this.storage.set(this.IDS, ids);
        
        ToastAndroid.showWithGravity('Removed from favorites', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
}

class Series extends Entity {
    IDS = 'series.ids';
    ITEMS = 'series.items';

    getId(series) {
        return series.id;
    }
}

class Video extends Entity {
    IDS = 'video.ids';
    ITEMS = 'video.items';

    getId(video) {
        return video.gist.id;
    }
}

export default class Favorite {
    static series() {
        return new Series;
    }

    static video() {
        return new Video;
    }
}