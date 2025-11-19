// pages/master-timetable/master-timetable.js
Page({
  data: {
    allTimetable: [],
    isLoading: true,
    // --- 新增下面这两个属性 ---
    showDetailModal: false, // 控制详情弹窗的显示/隐藏
    selectedCourse: null,  // 存放当前被点击的课程信息
    dayChars: ["", "一", "二", "三", "四", "五", "六", "日"]
  },
  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.fetchTimetable(userInfo.UserID);
    }
  },
  fetchTimetable: function(userId) {
    this.setData({ isLoading: true });
    // 【重要】请确保这里的 IP 地址和端口是你正在运行的后端服务的地址
    const apiUrl = `https://localhost:44332/api/miniprogram/timetable?userId=${userId}`; 
    wx.request({
      url: apiUrl,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ allTimetable: res.data, isLoading: false });
        }
      },
      fail: (err) => {
        this.setData({ isLoading: false });
        wx.showToast({ title: '加载失败', icon: 'error' });
      }
    });
  },

  // --- 新增下面这两个函数 ---
  // 点击课程格子时触发
  showCourseDetail: function(e) {
    const course = e.currentTarget.dataset.course;
    if (!course) return; // 如果点击的是空格子，则不执行任何操作
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
  }
})