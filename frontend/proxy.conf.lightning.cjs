module.exports = [{ context: ['/api/**'], target: 'http://127.0.0.1:4581', secure: false, changeOrigin: true, proxyTimeout: 15000 }];
