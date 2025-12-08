const { request, getCachedUser } = require('../../utils/api');

Page({
  data: {
    stats: null,
    loading: true
  },
  onLoad() {
    this.loadStats();
  },
  onPullDownRefresh() {
    this.loadStats();
  },
  loadStats() {
    const userInfo = getCachedUser();
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }

    this.setData({ loading: true });
    request(`/stats?userId=${userInfo.UserID}`)
      .then((data) => {
        this.setData({ stats: data, loading: false });
      })
      .catch((err) => {
        console.error('统计获取失败', err);
        wx.showToast({ title: '数据加载失败', icon: 'error' });
        this.setData({ loading: false });
      })
      .finally(() => {
        wx.stopPullDownRefresh();
      });
  }
});
