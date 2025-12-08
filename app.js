// app.js
const { API_BASE } = require('./utils/api');

App({
  onLaunch() {
    // 初始化全局配置，便于后续请求引用
    this.globalData = {
      userInfo: null,
      apiBase: API_BASE
    };
  }
});
