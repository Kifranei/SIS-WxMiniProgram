Page({
  data: {
    gradeList: [],
    loading: true
  },
  onLoad: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if(userInfo) {
      // 记得把 localhost 换成你的 IP
      wx.request({
        url: `https://localhost:44332/api/miniprogram/grades?userId=${userInfo.UserID}`, 
        success: (res) => {
          this.setData({ gradeList: res.data, loading: false });
        }
      })
    }
  }
})