const { getStoredUser } = require('../utils/auth');

Page({
  onLoad() {
    const userInfo = getStoredUser();
    wx.reLaunch({
      url: userInfo ? '/pages/main/main' : '/pages/index/index'
    });
  }
});
