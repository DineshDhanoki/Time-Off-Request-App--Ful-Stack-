const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api", // no rewrite needed
      },
      onProxyRes: function (proxyRes, req, res) {
        // Log proxy activity if needed
        // console.log('Proxy response:', req.method, req.path);
      },
      onError: function (err, req, res) {
        console.error("Proxy error:", err);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Something went wrong with the proxy server: " + err.message);
      },
    })
  );

  // WebSocket proxy for real-time notifications
  app.use(
    "/ws",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
      ws: true, // enable WebSocket proxy
      logLevel: "warn",
    })
  );
};
