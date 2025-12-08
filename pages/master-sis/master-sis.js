const { request, getCachedUser } = require('../../utils/api');

Page({
  data: {
    allTimetable: [],
    isLoading: true,
    showDetailModal: false,
    selectedCourse: null,
    dayChars: ['', '一', '二', '三', '四', '五', '六', '日']
  },
  onLoad() {
    this.loadMasterTimetable();
  },
  onPullDownRefresh() {
    this.loadMasterTimetable();
  },
  loadMasterTimetable() {
    const userInfo = getCachedUser();
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }

    this.setData({ isLoading: true });
    request(`/timetable?userId=${userInfo.UserID}`)
      .then((data) => {
        this.setData({ allTimetable: data, isLoading: false });
      })
      .catch((err) => {
        console.error('总课表获取失败', err);
        wx.showToast({ title: '加载失败', icon: 'error' });
        this.setData({ isLoading: false });
      })
      .finally(() => {
        wx.stopPullDownRefresh();
      });
  },

  showCourseDetail(e) {
    const course = e.currentTarget.dataset.course;
    if (!course) return;
    this.setData({
      showDetailModal: true,
      selectedCourse: course
    });
  },

  hideModal() {
    this.setData({ showDetailModal: false });
  }
});
