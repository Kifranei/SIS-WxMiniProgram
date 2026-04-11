const { requireLogin, redirectToLogin, handleAuthFailure } = require('../../utils/auth');

Page({
  data: {
    userInfo: null,
    roleName: '',
    isAdmin: false,
    allTimetable: [],
    weekArray: Array.from({ length: 21 }, (_, k) => `第${k + 1} 周`),
    currentWeek: 1,
    isLoading: true,
    showDetailModal: false,
    selectedCourse: null,
    dayChars: ['', '一', '二', '三', '四', '五', '六', '日']
  },

  onLoad() {
    this.initializePage();
  },

  onShow() {
    const { userInfo, isAdmin } = this.data;
    if (!userInfo) {
      this.initializePage();
      return;
    }

    if (!isAdmin) {
      this.fetchTimetable(userInfo.UserID);
    }
  },

  initializePage() {
    const userInfo = requireLogin();
    if (!userInfo) {
      return;
    }

    const roleMap = { 0: '管理员', 1: '教师', 2: '学生' };
    const userRole = userInfo.Role !== undefined ? userInfo.Role : -1;
    const isAdmin = userRole === 0;

    this.setData({
      userInfo,
      roleName: roleMap[userRole] || '未知用户',
      isAdmin,
      isLoading: !isAdmin
    });
  },

  fetchTimetable(userId) {
    this.setData({ isLoading: true });
    const apiUrl = `https://localhost:44332/api/miniprogram/timetable?userId=${userId}`;

    wx.request({
      url: apiUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            allTimetable: res.data,
            isLoading: false
          });
        } else {
          this.setData({ isLoading: false });
          if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 400 || res.statusCode === 404) {
            handleAuthFailure('登录状态已失效，请重新登录');
          }
        }
      },
      fail: () => {
        this.setData({ isLoading: false });
      }
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
    if (this.data.isAdmin) {
      return;
    }

    const course = e.currentTarget.dataset.course;
    if (!course) {
      return;
    }

    this.setData({
      showDetailModal: true,
      selectedCourse: course
    });
  },

  hideModal() {
    this.setData({ showDetailModal: false });
  },

  navigateToMaster() {
    if (this.data.isAdmin) {
      return;
    }

    wx.navigateTo({ url: '/pages/master-sis/master-sis' });
  },

  navigateToGrades() {
    wx.navigateTo({ url: '/pages/grades/grades' });
  },

  navigateToCourseSelection() {
    wx.navigateTo({ url: '/pages/course-selection/course-selection' });
  },

  navigateToMyCourses() {
    wx.navigateTo({ url: '/pages/my-courses/my-courses' });
  },

  navigateToAdminStats() {
    wx.navigateTo({ url: '/pages/admin-stats/admin-stats' });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          redirectToLogin();
        }
      }
    });
  }
});
