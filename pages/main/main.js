// pages/main/main.js
Page({
  data: {
    userInfo: null,
    allTimetable: [],
    weekArray: Array.from({ length: 21 }, (v, k) => `第 ${k + 1} 周`),
    currentWeek: 1,
    isLoading: true,
    showDetailModal: false,
    selectedCourse: null,
    dayChars: ["", "一", "二", "三", "四", "五", "六", "日"]
  },
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }
    this.setData({ userInfo: userInfo });
    this.fetchTimetable(userInfo.UserID);
  },
  fetchTimetable: function(userId) {
    this.setData({ isLoading: true });
    const apiUrl = `https://localhost:44332/api/miniprogram/timetable?userId=${userId}`;
    wx.request({
      url: apiUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ allTimetable: res.data, isLoading: false });
        }
      },
      fail: (err) => { this.setData({ isLoading: false }); }
    });
  },
  // 当 swiper 滑动时，更新顶部的周数显示
  onWeekChange: function(e) {
    if (e.detail.source === 'touch') { // 确保是用户滑动触发的
        this.setData({
            currentWeek: e.detail.current + 1
        });
    }
  },
  // 点击“上一周”按钮
  prevWeek: function() {
    if (this.data.currentWeek > 1) {
      this.setData({ currentWeek: this.data.currentWeek - 1 });
    }
  },
  // 点击“下一周”按钮
  nextWeek: function() {
    if (this.data.currentWeek < 21) {
      this.setData({ currentWeek: this.data.currentWeek + 1 });
    }
  },
  // 点击课程格子，显示详情
  showCourseDetail: function(e) {
    const course = e.currentTarget.dataset.course;
    if (!course) return;
    this.setData({ showDetailModal: true, selectedCourse: course });
  },
  // 关闭弹窗
  hideModal: function() {
    this.setData({ showDetailModal: false });
  },
  // 跳转到总课表页面
  navigateToMaster: function() {
    wx.navigateTo({
      url: '/pages/master-timetable/master-timetable',
    })
  }
});