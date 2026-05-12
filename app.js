App({
  onLaunch() {
    wx.login({
      success: res => {
        this.globalData.wxLoginCode = res.code
      }
    })
  },
  globalData: {
    userInfo: null,
    wxLoginCode: ''
  }
})
