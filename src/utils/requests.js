import { getCookie } from './utils';

/**
 * Sends http request with JSON data to a specified url
 *
 * @param {string} method method to use: GET/POST/PUT/DELETE
 * @param {string} url url to which the request will be sent
 * @param {object} data post/put/delete dict, that will be JSONed
 * @returns {Promise<object>} returns fetch's response
 */
export function request(method, url, data = {}) {
    let params = {};
    if (!['GET', 'HEAD'].includes(method) && data) {
        params = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCookie('_csrf')
            },
            body: JSON.stringify(data)
        };
    }

    return fetch(url, {
        method: method,
        mode: 'cors',
        credentials: 'include',
        ...params
    });
}

function toArgs(data) {
    let str = Object.keys(data).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    ).join('&');
    if (str.length > 0)
        str = '?' + str
    return str;
}

export default class ApiRequests {
    apiUrl = undefined;

    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    request(method, path, data = {}) {
        return request(method, this.apiUrl + path, data);
    }

    async _ResponseToJson(response) {
        let data = {};
        try {
            data = await response.json();
            data.ok_ = response.ok;
        } catch {
            data.ok_ = false;
        }
        return data;
    }

    async get(path, data = {}) {
        return await this._ResponseToJson(await this.request('GET', path + toArgs(data), {}));
    }
    async post(path, data = {}) {
        return await this._ResponseToJson(await this.request('POST', path, data));
    }
    async put(path, data = {}) {
        return await this._ResponseToJson(await this.request('PUT', path, data));
    }
    async delete(path, data = {}) {
        return await this._ResponseToJson(await this.request('DELETE', path, data));
    }
}
