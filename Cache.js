import { AsyncStorage } from 'react-native';
import moment from 'moment';

class CacheStore {
    prefix = 'cache';

    async get(key, callback = null, minutes = 60) {
        let data = await AsyncStorage.getItem(this.data(key));
        if (! data) {
            let newData = await callback();
            this.remember(key, newData, minutes);

            return newData;
        }

        let expired = await this.expired(key, minutes);

        if (expired && callback) {
            this.forget(key).then(() => {
                callback().then(asyncData => {
                    this.remember(key, asyncData, minutes);
                });
            });
        }

        return JSON.parse(data);
    }

    async remember(key, data, minutes = 60) {
        await AsyncStorage.setItem(this.data(key), JSON.stringify(data));
        await AsyncStorage.setItem(this.duration(key), `${minutes}`);
        await AsyncStorage.setItem(this.time(key), moment().format());
    }

    async forget(key) {
        await AsyncStorage.removeItem(this.time(key));
        await AsyncStorage.removeItem(this.duration(key));
        await AsyncStorage.removeItem(this.data(key));
    }

    async expired(key, wrt = null) {
        let time = await AsyncStorage.getItem(this.time(key));
        if (! time) {
            return true;
        }

        let duration = wrt ? wrt : await AsyncStorage.getItem(this.duration(key));
        if (! duration) {
            return true;
        }

        let delta = moment.duration(moment().diff(moment(time)));

        return delta.asMinutes() > duration;
    }

    async clear() {
        let keys = await AsyncStorage.getAllKeys();

        let forDelete = keys.filter(item => item.startsWith(`${this.prefix}.`));
        await AsyncStorage.multiRemove(forDelete);
    }

    async clean() {
        let keys = await AsyncStorage.getAllKeys();
        let cacheKeys = keys.filter(item => item.startsWith(`${this.prefix}.`));
        let timeKeys = cacheKeys.filter(item => item.endsWith('.time'));

        timeKeys.forEach(key => {
            let actual = key.split('.').slice(1, -1).join('.');
            
            this.expired(actual).then(expired => {
                expired ? this.forget(actual) : null;
            });
        });
    }

    data(key) {
        return `${this.prefix}.${key}.data`;
    }

    duration(key) {
        return `${this.prefix}.${key}.expiry`;
    }

    time(key) {
        return `${this.prefix}.${key}.time`;
    }
}

const Cache = new CacheStore();
export default Cache;