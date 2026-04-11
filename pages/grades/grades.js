const { requireLogin, handleAuthFailure } = require('../../utils/auth');

Page({
  data: {
    gradeList: [],
    loading: true
  },
  onLoad: function () {
    const userInfo = requireLogin();
    if (!userInfo) {
      return;
    }

    wx.request({
      url: `https://localhost:44332/api/miniprogram/grades?userId=${userInfo.UserID}`, 
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ gradeList: res.data, loading: false });
          return;
        }

        this.setData({ loading: false });
        if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 400 || res.statusCode === 404) {
          handleAuthFailure('登录状态已失效，请重新登录');
        }
      },
      fail: () => {
        this.setData({ loading: false });
      }
    });
  }
});
