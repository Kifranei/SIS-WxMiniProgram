const { request, getCachedUser } = require('../../utils/api');

Page({
  data: {
    courseList: [],
    loading: true
  },
  onLoad() {
    this.loadCourses();
  },
  onPullDownRefresh() {
    this.loadCourses();
  },
  loadCourses() {
    const userInfo = getCachedUser();
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }

    this.setData({ loading: true });
    request(`/mycourses?userId=${userInfo.UserID}`)
      .then((data) => {
        this.setData({ courseList: data, loading: false });
      })
      .catch((err) => {
        console.error('课程获取失败', err);
        wx.showToast({ title: '课程加载失败', icon: 'error' });
        this.setData({ loading: false });
      })
      .finally(() => {
        wx.stopPullDownRefresh();
      });
  }
});
