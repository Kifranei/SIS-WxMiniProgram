const { buildApiUrl } = require('../../utils/api');
const { getStoredUser } = require('../../utils/auth');

// pages/index/index.js
Page({
  data: {
    username: '',
    password: '',
    errorMessage: '',
    submitting: false
  },

  onLoad() {
    const userInfo = getStoredUser();
    if (userInfo) {
      wx.reLaunch({ url: '/pages/main/main' });
    }
  },

  // 监听用户名输入
  onUsernameInput: function(e) {
    this.setData({
      username: e.detail.value,
      errorMessage: ''
    });
  },

  // 监听密码输入
  onPasswordInput: function(e) {
    this.setData({
      password: e.detail.value,
      errorMessage: ''
    });
  },

  // 点击登录按钮时触发
  onLoginTap: function() {
    if (this.data.submitting) {
      return;
    }

    if (!this.data.username.trim() || !this.data.password) {
      this.setData({ errorMessage: '请输入用户名和密码。' });
      return;
    }

    // ## 这里是你后端 API 的地址 ##
    // 请确保你的 Visual Studio 项目正在运行！
    const apiUrl = buildApiUrl('login');
    this.setData({
      submitting: true,
      errorMessage: ''
    });

    // wx.request 是小程序发送网络请求的核心 API
    wx.request({
      url: apiUrl,
      method: 'POST', // 我们的登录接口是 POST 请求
      data: { // 这里是我们要发送给后端的数据
        Username: this.data.username,
        Password: this.data.password
      },
      success: (res) => { // 请求成功的回调函数
        if (res.statusCode === 200) {
          // 将用户信息保存到小程序的本地缓存中，方便其他页面使用
          wx.setStorageSync('userInfo', res.data);

          // 跳转到主页 (我们假设主页叫 main)
          wx.reLaunch({
            url: '/pages/main/main' // 你需要创建一个 main 页面
          });

        } else {
          // 其他 HTTP 状态码，比如 401 (Unauthorized)
          this.setData({ errorMessage: '用户名或密码错误！' });
        }
      },
      fail: (err) => { // 请求失败的回调函数
        console.error('请求失败', err);
        this.setData({ errorMessage: '无法连接到服务器，请检查网络。' });
      },
      complete: () => {
        this.setData({ submitting: false });
      }
    });
  }
});
