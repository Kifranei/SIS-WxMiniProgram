const { request, getRoleName, getCachedUser, clearUser } = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    allTimetable: [],
    weekArray: Array.from({ length: 21 }, (v, k) => `第 ${k + 1} 周`),
    currentWeek: 1,
    isLoading: true,
    showDetailModal: false,
    selectedCourse: null,
    dayChars: ['', '一', '二', '三', '四', '五', '六', '日'],
    roleName: '',
    dashboardStats: null
  },

  onLoad() {
    this.bootstrap();
  },

  onShow() {
    // 返回页面时如果缓存丢失，则重新初始化
    if (!this.data.userInfo) {
      this.bootstrap();
    }
  },

  bootstrap() {
    const userInfo = getCachedUser();
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }

    const roleName = getRoleName(userInfo.Role);
    this.setData({
      userInfo,
      roleName
    });

    this.fetchTimetable(userInfo.UserID);
    if (userInfo.Role === 0) {
      this.fetchDashboard(userInfo.UserID);
    }
  },

  fetchTimetable(userId) {
    this.setData({ isLoading: true });
    request(`/timetable?userId=${userId}`)
      .then((data) => {
        this.setData({
          allTimetable: data,
          isLoading: false
        });
      })
      .catch((err) => {
        console.error('课表获取失败', err);
        wx.showToast({ title: '课表加载失败', icon: 'error' });
        this.setData({ isLoading: false });
      });
  },

  fetchDashboard(userId) {
    request(`/stats?userId=${userId}`)
      .then((data) => {
        this.setData({ dashboardStats: data });
      })
      .catch(() => {
        this.setData({ dashboardStats: null });
      });
  },

  onWeekChange(e) {
    if (e.detail.source === 'touch') {
      this.setData({ currentWeek: e.detail.current + 1 });
    }
  },

  prevWeek() {
    if (this.data.currentWeek > 1) {
      this.setData({ currentWeek: this.data.currentWeek - 1 });
    }
  },

  nextWeek() {
    if (this.data.currentWeek < 21) {
      this.setData({ currentWeek: this.data.currentWeek + 1 });
    }
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
  },

  navigateToMaster() {
    wx.navigateTo({ url: '/pages/master-sis/master-sis' });
  },

  navigateToGrades() {
    wx.navigateTo({ url: '/pages/grades/grades' });
  },

  navigateToMyCourses() {
    wx.navigateTo({ url: '/pages/my-courses/my-courses' });
  },

  navigateToAdminStats() {
    wx.navigateTo({ url: '/pages/admin-stats/admin-stats' });
  },

  onPullDownRefresh() {
    if (!this.data.userInfo) return;
    this.fetchTimetable(this.data.userInfo.UserID);
    if (this.data.userInfo.Role === 0) {
      this.fetchDashboard(this.data.userInfo.UserID);
    }
    wx.stopPullDownRefresh();
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          clearUser();
          wx.reLaunch({ url: '/pages/index/index' });
        }
      }
    });
  }
});
