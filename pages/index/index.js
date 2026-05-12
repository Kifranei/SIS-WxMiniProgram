const { buildApiUrl } = require('../../utils/api');
const { getStoredUser } = require('../../utils/auth');

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
  onUsernameInput: function(e) {
    this.setData({
      username: e.detail.value,
      errorMessage: ''
    });
  },
  onPasswordInput: function(e) {
    this.setData({
      password: e.detail.value,
      errorMessage: ''
    });
  },

  onLoginTap: function() {
    if (this.data.submitting) {
      return;
    }

    if (!this.data.username.trim() || !this.data.password) {
      this.setData({ errorMessage: '请输入用户名和密码。' });
      return;
    }

    const apiUrl = buildApiUrl('login');
    this.setData({
      submitting: true,
      errorMessage: ''
    });

    wx.request({
      url: apiUrl,
      method: 'POST',
      data: {
        Username: this.data.username,
        Password: this.data.password
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.setStorageSync('userInfo', res.data);

          wx.reLaunch({
            url: '/pages/main/main'
          });

        } else {
          this.setData({ errorMessage: '用户名或密码错误！' });
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
        this.setData({ errorMessage: '无法连接到服务器，请检查网络。' });
      },
      complete: () => {
        this.setData({ submitting: false });
      }
    });
  }
});
