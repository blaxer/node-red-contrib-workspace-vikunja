module.exports = function(RED) {
    const http = require('http');
    const https = require('https');

    function parseUrl(url) {
        try {
            return new URL(url);
        } catch (e) {
            const protocol = url.includes('https') ? 'https://' : 'http://';
            return new URL(protocol + url.replace(/^\/+/, ''));
        }
    }

    function createClient(config) {
        const parsedUrl = parseUrl(config.url);
        const token = config.token;

        function makeRequest(options, postData) {
            return new Promise((resolve, reject) => {
                options.hostname = parsedUrl.hostname;
                options.port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);
                options.headers = options.headers || {};
                options.headers['Authorization'] = `Bearer ${token}`;
                options.headers['Content-Type'] = 'application/json';
                options.timeout = 10000;

                const protocol = parsedUrl.protocol === 'https:' ? https : http;

                const req = protocol.request(options, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            if (data) {
                                try {
                                    resolve(JSON.parse(data));
                                } catch (e) {
                                    reject(new Error('Failed to parse response: ' + e.message));
                                }
                            } else {
                                resolve({});
                            }
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                        }
                    });
                });

                req.on('error', reject);
                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error('Request timeout'));
                });

                if (postData) {
                    req.write(postData);
                }
                req.end();
            });
        }

        return {
            getTasks: function(projectId) {
                return makeRequest({
                    path: `/api/v1/projects/${projectId}/tasks`,
                    method: 'GET'
                });
            },

            createTask: function(projectId, taskData) {
                const postData = JSON.stringify(taskData);
                return makeRequest({
                    path: `/api/v1/projects/${projectId}/tasks`,
                    method: 'POST',
                    headers: {
                        'Content-Length': Buffer.byteLength(postData)
                    }
                }, postData);
            },

            updateTask: function(taskId, taskData) {
                const postData = JSON.stringify(taskData);
                return makeRequest({
                    path: `/api/v1/tasks/${taskId}`,
                    method: 'PUT',
                    headers: {
                        'Content-Length': Buffer.byteLength(postData)
                    }
                }, postData);
            },

            deleteTask: function(taskId) {
                return makeRequest({
                    path: `/api/v1/tasks/${taskId}`,
                    method: 'DELETE'
                });
            },

           toggleTaskCompletion: function(taskId) {
                return makeRequest({
                    path: `/api/v1/tasks/${taskId}`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, JSON.stringify({ done: true }));
            }
        };
    }

    return {
        createClient
    };
};
