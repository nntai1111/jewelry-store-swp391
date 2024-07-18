// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://giavang.doji.vn',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api/giavang', // rewrite path
      },
    })
  );
};
