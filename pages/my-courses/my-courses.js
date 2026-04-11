const API_BASE = 'https://localhost:44332/api/miniprogram';
const { requireLogin, handleAuthFailure } = require('../../utils/auth');

Page({
  data: {
    courseList: [],
    loading: true,
    loadError: ''
  },

  onLoad() {
    this.loadCourses();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadCourses(true);
    }
  },

  onPullDownRefresh() {
    this.loadCourses(false, () => wx.stopPullDownRefresh());
  },

  loadCourses(silent, done) {
    const userInfo = requireLogin();
    if (!userInfo) {
      if (done) done();
      return;
    }

    if (userInfo.Role !== 1) {
      this.setData({
        loading: false,
        loadError: '仅教师可访问该页面'
      });
      if (done) done();
      return;
    }

    if (!silent) {
      this.setData({
        loading: true,
        loadError: ''
      });
    }

    wx.request({
      url: `${API_BASE}/mycourses?userId=${userInfo.UserID}`,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            courseList: res.data || [],
            loading: false,
            loadError: ''
          });
          return;
        }

        this.setData({
          loading: false,
          loadError: `课程加载失败 (${res.statusCode})`
        });
        if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 400 || res.statusCode === 404) {
          handleAuthFailure('登录状态已失效，请重新登录');
        }
      },
      fail: () => {
        this.setData({
          loading: false,
          loadError: '无法连接教师课程接口'
        });
      },
      complete: () => {
        if (done) done();
      }
    });
  },

  openGradeEntry(e) {
    const courseId = e.currentTarget.dataset.courseId;
    if (!courseId) {
      return;
    }

    wx.navigateTo({
      url: `/pages/teacher-grade-entry/teacher-grade-entry?courseId=${courseId}`
    });
  }
});
