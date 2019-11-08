module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/websocket': {
        target: 'http://localhost:7788/',
        changeOrigin: true
      }
    }
  }
}
