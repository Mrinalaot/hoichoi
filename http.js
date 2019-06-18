import axios from "axios";
import config from "./config";

export default (token = null) => {
    if (token) {
        return axios.create({
            baseURL: config.baseURL,
            headers: {
                'x-api-key': config.apiKey,
                Authorization: token,
            }
        })
    }

    return axios.create({
        baseURL: config.baseURL,
        headers: {
            'x-api-key': config.apiKey,
        }
    });
};