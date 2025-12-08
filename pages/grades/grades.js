const { request, getCachedUser } = require('../../utils/api');

Page({
  data: {
    gradeList: [],
    loading: true
  },
  onLoad() {
    this.loadGrades();
  },
  onPullDownRefresh() {
    this.loadGrades();
  },
  loadGrades() {
    const userInfo = getCachedUser();
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }

    this.setData({ loading: true });
    request(`/grades?userId=${userInfo.UserID}`)
      .then((data) => {
        this.setData({ gradeList: data, loading: false });
      })
      .catch((err) => {
        console.error('成绩获取失败', err);
        wx.showToast({ title: '成绩加载失败', icon: 'error' });
        this.setData({ loading: false });
      })
      .finally(() => {
        wx.stopPullDownRefresh();
      });
  }
});
