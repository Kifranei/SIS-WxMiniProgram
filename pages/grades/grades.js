const { buildApiUrl } = require('../../utils/api');
const { requireLogin, isAuthFailureStatus, handleAuthFailure } = require('../../utils/auth');

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
      url: buildApiUrl(`grades?userId=${userInfo.UserID}`),
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ gradeList: res.data, loading: false });
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
  }
});
