// pages/admin-stats/admin-stats.js
Page({
  data: {
    stats: null,
    loading: true
  },
  onLoad: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if(userInfo) {
      wx.request({
        url: `https://localhost:44332/api/miniprogram/stats?userId=${userInfo.UserID}`,
        success: (res) => {
          if (res.statusCode === 200) {
             this.setData({ stats: res.data, loading: false });
          }
        },
        fail: () => {
            this.setData({ loading: false });
        }
      })
    }
  },
  // 添加一个刷新功能
  onPullDownRefresh: function() {
      this.onLoad();
      wx.stopPullDownRefresh();
  }
})