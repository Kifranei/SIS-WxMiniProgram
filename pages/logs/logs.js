// logs.js
const util = require('../../utils/util.js')
const { requireLogin } = require('../../utils/auth');

Page({
  data: {
    logs: []
  },
  onLoad() {
    const userInfo = requireLogin();
    if (!userInfo) {
      return;
    }

    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
});
