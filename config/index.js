const Config = {
  title: 'pet系统',
  get baseApi() {
    return (process.env.VUE_APP_ENV === 'development' && process.env.VUE_APP_BASE_CLIENT_ID === 'localhost') // 多个地址，还可以写成switch
      ? 'http://localhost:5000/api'
      : 'http://admin.api.5656dh.com/api'
  }
}
module.exports = Config
