const { buildApiUrl } = require('../../utils/api');
const { requireLogin, isAuthFailureStatus, handleAuthFailure } = require('../../utils/auth');

// pages/admin-stats/admin-stats.js
Page({
  data: {
    stats: null,
    loading: true
  },
  onLoad: function () {
    const userInfo = requireLogin();
    if (!userInfo) {
      return;
    }

    wx.request({
        url: buildApiUrl(`stats?userId=${userInfo.UserID}`),
      success: (res) => {
        if (res.statusCode === 200) {
           this.setData({ stats: res.data, loading: false });
           return;
        }

        this.setData({ loading: false });
        if (isAuthFailureStatus(res.statusCode)) {
          handleAuthFailure('登录状态已失效，请重新登录');
        }
      },
      fail: () => {
          this.setData({ loading: false });
      }
    });
  },
  // 添加一个刷新功能
  onPullDownRefresh: function() {
      this.onLoad();
      wx.stopPullDownRefresh();
  }
})
