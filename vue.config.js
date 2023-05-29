const fs = require('fs')
module.exports = {
  devServer: {
    host: 'dev.local',
    port: 8080,
    https: {
      key: fs.readFileSync('./certs/dev.local+4-key.pem'),
      cert: fs.readFileSync('./certs/dev.local+4.pem'),
      //ca: fs.readFileSync('./certs/my-ca.crt')
    },
    proxy: {
      '^/api': {
        target: 'http://localhost:1337',
        changeOrigin: true
      },
    }
  }
}