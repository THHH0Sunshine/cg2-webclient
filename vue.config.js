module.exports = {
  devServer: {
    proxy: {
      '/websocket': {
        target: 'http://localhost:7788/',
        changeOrigin: true
      }
    }
  }
}