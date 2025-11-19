Page({
  data: {
    courseList: [],
    loading: true
  },
  onLoad: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if(userInfo) {
      wx.request({
        url: `https://localhost:44332/api/miniprogram/mycourses?userId=${userInfo.UserID}`,
        success: (res) => {
          this.setData({ courseList: res.data, loading: false });
        }
      })
    }
  }
})