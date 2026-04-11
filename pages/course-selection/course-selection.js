const API_BASE = 'https://localhost:44332/api/miniprogram';
const { requireLogin, handleAuthFailure } = require('../../utils/auth');

Page({
  data: {
    loading: true,
    loadError: '',
    currentTab: 'other',
    studentName: '',
    sportsCoursesTaken: 0,
    otherCoursesTaken: 0,
    enrolledElectives: [],
    sportsElectives: [],
    otherElectives: [],
    submittingCourseId: null
  },

  onLoad() {
    this.loadCourseSelection();
  },

  onPullDownRefresh() {
    this.loadCourseSelection(() => wx.stopPullDownRefresh());
  },

  loadCourseSelection(done) {
    const userInfo = requireLogin();
    if (!userInfo) {
      if (done) done();
      return;
    }

    if (userInfo.Role !== 2) {
      this.setData({ loadError: '仅学生可访问该页面', loading: false });
      wx.showToast({ title: '仅学生可访问', icon: 'none' });
      wx.navigateBack({ delta: 1 });
      if (done) done();
      return;
    }

    this.setData({ loading: true, loadError: '' });
    wx.request({
      url: `${API_BASE}/course-selection?userId=${userInfo.UserID}`,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            loading: false,
            loadError: '',
            studentName: res.data.StudentName || '',
            sportsCoursesTaken: res.data.SportsCoursesTaken || 0,
            otherCoursesTaken: res.data.OtherCoursesTaken || 0,
            enrolledElectives: res.data.EnrolledElectives || [],
            sportsElectives: res.data.SportsElectives || [],
            otherElectives: res.data.OtherElectives || []
          });
        } else {
          const message = (res.data && (res.data.message || res.data.Message)) || `接口加载失败 (${res.statusCode})`;
          this.setData({ loading: false, loadError: message });
          wx.showToast({ title: '接口加载失败', icon: 'none' });
          if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 400 || res.statusCode === 404) {
            handleAuthFailure('登录状态已失效，请重新登录');
          }
        }
      },
      fail: () => {
        this.setData({ loading: false, loadError: '无法连接在线选课接口，请确认后端项目已重启并包含新 API。' });
        wx.showToast({ title: '网络异常', icon: 'none' });
      },
      complete: () => {
        if (done) done();
      }
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (!tab || tab === this.data.currentTab) {
      return;
    }

    this.setData({ currentTab: tab });
  },

  selectCourse(e) {
    const courseId = e.currentTarget.dataset.courseId;
    this.submitCourseAction(courseId, 'select', '确定选择这门课程吗？');
  },

  withdrawCourse(e) {
    const courseId = e.currentTarget.dataset.courseId;
    this.submitCourseAction(courseId, 'withdraw', '确定退选这门课程吗？');
  },

  submitCourseAction(courseId, action, confirmText) {
    if (!courseId || this.data.submittingCourseId) {
      return;
    }

    const userInfo = requireLogin();
    if (!userInfo) {
      return;
    }

    wx.showModal({
      title: '确认操作',
      content: confirmText,
      success: (modalRes) => {
        if (!modalRes.confirm) {
          return;
        }

        this.setData({ submittingCourseId: courseId });
        wx.request({
          url: `${API_BASE}/course-selection/${action}`,
          method: 'POST',
          header: { 'content-type': 'application/json' },
          data: {
            userId: userInfo.UserID,
            courseId
          },
          success: (res) => {
            if (res.statusCode === 200) {
              wx.showToast({
                title: res.data.message || '操作成功',
                icon: 'success'
              });
              this.loadCourseSelection();
              return;
            }

            wx.showToast({
              title: (res.data && res.data.message) || '操作失败',
              icon: 'none',
              duration: 2600
            });
            if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 400 || res.statusCode === 404) {
              handleAuthFailure('登录状态已失效，请重新登录');
            }
          },
          fail: () => {
            wx.showToast({ title: '网络异常', icon: 'none' });
          },
          complete: () => {
            this.setData({ submittingCourseId: null });
          }
        });
      }
    });
  }
});
