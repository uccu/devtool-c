import qs from 'qs';
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import http from 'http';
import URL from 'url';

let projects;
let tool = {
    api: function (url, params, options) {

        let headers = {
            'content-type': 'application/x-www-form-urlencoded'
        };

        if (options && options.headers) {
            for (let i in options.headers) {
                headers[i] = options.headers[i];
            }
        }
        const rest = (options && options.rest) || [];

        for (let i in rest) {
            url += '/' + i + '/' + encodeURIComponent(rest[i]);
        }

        const method = (options && options.method) || 'post';
        const responseType = (options && options.responseType) || 'json';
        const timeout = (options && options.timeout) || 5000;
        const proxy = (options && options.proxy) || undefined;

        let data = '';
        if (method != 'get') {
            data = headers['content-type'] == 'application/x-www-form-urlencoded' ? qs.stringify(params) : params;
        } else {
            const myURL = new URL.parse(url);
            url += (myURL.search ? '&' : '?') + qs.stringify(params);
        }


        return axios({
            url,
            data,
            method,
            headers,
            timeout,
            responseType,
            proxy,
            withCredentials: true
        }).then(data => {
            return data.data;
        });
    },
    request: function () {
        const req = http.request({
            host: 'api.chat.baka',
            path: '/blog/menu',
            method: 'POST',
            timeout: 5000,
            headers: {
                // origin: 'http://d.baka'
            }
        }, (res) => {
            console.log(res);
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
    },
    getProjects() {
        if (projects) return projects;

        let exePath = process.cwd();
        if (!fs.existsSync(exePath + '/proejcts.json')) {
            fs.writeFileSync(exePath + '/proejcts.json', '{}');
            projects = {};
            return projects;
        }
        projects = JSON.parse(fs.readFileSync(exePath + '/proejcts.json'));
        return projects;
    },
    getProject(name) {
        return tool.getProjects()[name];
    },
    getProjectApiList(name) {
        let project = tool.getProjects()[name];
        if (!project) return undefined;
        return project.apiList;
    },
    updProjects(data = {}) {
        let exePath = process.cwd();
        return fs.writeFileSync(exePath + '/proejcts.json', JSON.stringify(data));
    },
    updProject(projectName, key, value) {
        if (!projects[projectName]) projects[projectName] = {};
        if (value) {
            projects[projectName][key] = value;
        } else {
            projects[projectName] = key;
        }
        return tool.updProjects(projects);
    },
    delProject(projectName) {
        delete projects[projectName];
        return tool.updProjects(projects);
    },
    updApi(projectName, apiName, apiInfo, value) {
        if (!apiInfo) return false;
        if (!apiName) return false;
        let apiList = tool.getProjectApiList(projectName);

        apiList = apiList || {};
        if (value) {
            if (!apiList[apiName]) apiList[apiName] = {};
            apiList[apiName][apiInfo] = apiInfo;
        } else {
            apiList[apiName] = apiInfo;
        }
        return tool.updProject(projectName, 'apiList', apiList);
    },
    delApi(projectName, apiName) {
        if (!apiName) return false;
        let apiList = tool.getProjectApiList(projectName);
        if (!apiList) return false;
        delete apiList[apiName];
        return tool.updProject(projectName, 'apiList', apiList);
    }
};

export default tool;