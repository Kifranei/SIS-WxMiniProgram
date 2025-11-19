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
    dayChars: ["", "一", "二", "三", "四", "五", "六", "日"],
    roleName: '' // 用于显示身份
  },

  onLoad: function(options) {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
      return;
    }

    // [修复点1]：先定义映射关系并计算出 roleName，然后再调用 setData
    const roleMap = { 1: '教师', 2: '学生', 0: '管理员' };
    // 防止 Role 字段不存在导致 undefined，增加默认值处理
    const userRole = userInfo.Role !== undefined ? userInfo.Role : -1; 
    const roleName = roleMap[userRole] || '未知用户';

    // [修复点2]：确保 setData 时，roleName 已经有了具体的值
    this.setData({
      userInfo: userInfo,
      roleName: roleName
    });

    this.fetchTimetable(userInfo.UserID);
  },

  fetchTimetable: function(userId) {
    this.setData({ isLoading: true });
    // 注意：真机调试时请将 localhost 替换为电脑 IP
    const apiUrl = `https://localhost:44332/api/miniprogram/timetable?userId=${userId}`;
    
    wx.request({
      url: apiUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            allTimetable: res.data,
            isLoading: false
          });
        }
      },
      fail: (err) => {
        console.error("课表获取失败", err);
        this.setData({ isLoading: false });
      }
    });
  },

  // 当 swiper 滑动时，更新顶部的周数显示
  onWeekChange: function(e) {
    if (e.detail.source === 'touch') {
      this.setData({
        currentWeek: e.detail.current + 1
      });
    }
  },

  // 点击“上一周”按钮
  prevWeek: function() {
    if (this.data.currentWeek > 1) {
      this.setData({
        currentWeek: this.data.currentWeek - 1
      });
    }
  },

  // 点击“下一周”按钮
  nextWeek: function() {
    if (this.data.currentWeek < 21) {
      this.setData({
        currentWeek: this.data.currentWeek + 1
      });
    }
  },

  // 点击课程格子，显示详情
  showCourseDetail: function(e) {
    const course = e.currentTarget.dataset.course;
    if (!course) return;
    this.setData({
      showDetailModal: true,
      selectedCourse: course
    });
  },

  // 关闭弹窗
  hideModal: function() {
    this.setData({
      showDetailModal: false
    });
  },

  // 跳转到总课表页面
  navigateToMaster: function() {
    wx.navigateTo({
      url: '/pages/master-sis/master-sis', // 确保路径与 app.json 一致
    });
  },

  // 跳转到成绩页
  navigateToGrades: function() {
    wx.navigateTo({ url: '/pages/grades/grades' });
  },
  // 跳转到教师课程页
  navigateToMyCourses: function() {
    wx.navigateTo({ url: '/pages/my-courses/my-courses' });
  },
  
  // 跳转到管理员统计页
  navigateToAdminStats: function() {
    wx.navigateTo({ url: '/pages/admin-stats/admin-stats' });
  },
  
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    });
  }

});